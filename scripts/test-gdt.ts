import {
  parseGdt,
  writeGdt,
  generateSampleAlbisGdtIn,
  decodeCp850,
  encodeCp850,
} from '../src/lib/gdt/gdtParser';

async function runGdtUnitTests() {
  console.log('====================================================');
  console.log('  U.D.O. ALBIS GDT 2.1 Parser & Writer Unit Test');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // TEST 1: Parse Sample ALBIS GDT-IN (Satzart 6302)
  console.log('--- Test 1: GDT-IN Parsing ---');
  const sampleGdtInText = generateSampleAlbisGdtIn('SYN-90412', 'Müller', 'Hans');
  const parsedInbound = parseGdt(sampleGdtInText);

  assert(parsedInbound.success === true, 'Parse GDT-IN should return success=true');
  assert(parsedInbound.record?.satzart === '6302', 'Satzart should be 6302');
  assert(parsedInbound.record?.patientId === 'SYN-90412', 'Patient ID should match SYN-90412');
  assert(parsedInbound.record?.lastName === 'Müller', 'Last name should be Müller');
  assert(parsedInbound.record?.firstName === 'Hans', 'First name should be Hans');
  assert(parsedInbound.record?.gender === '1', 'Gender should be 1 (männlich)');
  assert(parsedInbound.record?.isSynthetic === true, 'Patient should be detected as synthetic');

  // TEST 2: GDT-OUT Writer (Satzart 6310)
  console.log('\n--- Test 2: GDT-OUT Writer ---');
  const outboundResult = writeGdt({
    patientId: 'SYN-90412',
    caseId: 'BG-2026-9901-A',
    lastName: 'Müller',
    firstName: 'Hans',
    resultStatus: 'Gutachten erstellt, siehe UDO-Fallakte #BG-2026-9901-A',
  });

  assert(outboundResult.rawText.includes('80006310'), 'Outbound GDT must contain Satzart 6310');
  assert(outboundResult.rawText.includes('3000SYN-90412'), 'Outbound GDT must contain Patientennummer SYN-90412');
  assert(
    outboundResult.rawText.includes('6221Gutachten erstellt, siehe UDO-Fallakte #BG-2026-9901-A'),
    'Outbound GDT must contain status pointer in field 6221'
  );
  assert(!outboundResult.rawText.includes('Diagnose'), 'Outbound GDT must NOT contain diagnosis or report PHI text');

  // Verify 3-digit length calculation for each line
  const lines = outboundResult.rawText.split('\r\n').filter((l) => l.length > 0);
  let allLinesLengthValid = true;
  for (const line of lines) {
    const declaredLen = parseInt(line.slice(0, 3), 10);
    const actualByteLen = Buffer.byteLength(line, 'utf-8') + 2; // +2 for \r\n
    if (declaredLen !== actualByteLen) {
      allLinesLengthValid = false;
      console.error(`Line length mismatch: declared ${declaredLen}, actual ${actualByteLen} for "${line}"`);
    }
  }
  assert(allLinesLengthValid, 'All outbound lines must have exact 3-digit QMS length prefixes matching CRLF byte length');

  // TEST 3: Round-trip test (re-parse outbound GDT)
  console.log('\n--- Test 3: Round-Trip Re-Parsing ---');
  const reParsedOutbound = parseGdt(outboundResult.buffer);
  assert(reParsedOutbound.success === true, 'Re-parsing generated GDT-OUT should succeed');
  assert(reParsedOutbound.record?.patientId === 'SYN-90412', 'Re-parsed Patient ID should match');
  assert(reParsedOutbound.record?.satzart === '6310', 'Re-parsed Satzart should be 6310');

  // TEST 4: CP850 Umlaut Encoding
  console.log('\n--- Test 4: CP850 Umlaut Handling ---');
  const umlautString = 'Müller, Görlitz, Bärbel, Straßburg';
  const encodedBuf = encodeCp850(umlautString);
  const decodedStr = decodeCp850(encodedBuf);
  assert(decodedStr === umlautString, 'CP850 encoding/decoding should preserve German umlauts (ä, ö, ü, ß)');

  console.log('\n====================================================');
  console.log(`  Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runGdtUnitTests().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
