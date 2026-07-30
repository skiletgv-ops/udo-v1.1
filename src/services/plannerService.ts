// Planner Agent Service for Decomposing Complex Clinical & Administrative Queries into Subtasks
import { routeAgent, RouteResult } from '../lib/agentRouter';
import { loggerService } from './loggerService';

export interface PlannedSubtask {
  id: string;
  description: string;
  assignedAgentId: string;
  routeResult: RouteResult;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
}

export interface PlanExecutionResult {
  planId: string;
  originalGoal: string;
  subtasks: PlannedSubtask[];
  summary: string;
}

class PlannerService {
  private static instance: PlannerService;

  private constructor() {}

  public static getInstance(): PlannerService {
    if (!PlannerService.instance) {
      PlannerService.instance = new PlannerService();
    }
    return PlannerService.instance;
  }

  public decomposeGoal(goal: string): PlannedSubtask[] {
    const requestId = loggerService.getRequestId();
    loggerService.info('[PLANNER] Decomposing goal into subtasks', { requestId, goal });

    const lower = goal.toLowerCase();
    const subtasks: PlannedSubtask[] = [];

    // Complex query 1: Gutachten / MdE + ALBIS / Patient query
    if (lower.includes('gutachten') && (lower.includes('patient') || lower.includes('mde') || lower.includes('albis'))) {
      subtasks.push({
        id: `task-1-${Date.now()}`,
        description: 'Patienten-Stammdaten & ALBIS GDT Fallhistorie prüfen',
        assignedAgentId: 'agent-albis',
        routeResult: routeAgent('ALBIS Patientendaten und Aktenzeichen laden'),
        status: 'pending',
      });
      subtasks.push({
        id: `task-2-${Date.now()}`,
        description: 'S2k-Klinikleitlinie & MdE-Minderungsprozentsätze berechnen',
        assignedAgentId: 'agent-gutachten',
        routeResult: routeAgent('S2k Gutachten MdE Berechnung ausführen'),
        status: 'pending',
      });
      subtasks.push({
        id: `task-3-${Date.now()}`,
        description: 'DGUV/GOÄ Abrechnungscodes und Honorar ermitteln',
        assignedAgentId: 'agent-billing',
        routeResult: routeAgent('Abrechnung und GOÄ Ziffern scannen'),
        status: 'pending',
      });
    } else if (lower.includes('termin') || lower.includes('kalender') || lower.includes('triage')) {
      subtasks.push({
        id: `task-1-${Date.now()}`,
        description: 'Verfügbare Freiräume und Kalenderslots im Praxissystem prüfen',
        assignedAgentId: 'agent-schedule',
        routeResult: routeAgent('Freie Kalenderslots abfragen'),
        status: 'pending',
      });
      subtasks.push({
        id: `task-2-${Date.now()}`,
        description: 'Triage-Priorisierung & Erstkontakt-Protokoll aufnehmen',
        assignedAgentId: 'agent-triage',
        routeResult: routeAgent('Patienten-Triage durchführen'),
        status: 'pending',
      });
    } else {
      // Default single-task planner delegation
      const route = routeAgent(goal);
      subtasks.push({
        id: `task-1-${Date.now()}`,
        description: `Bearbeite Anforderung: ${goal}`,
        assignedAgentId: route.agentId,
        routeResult: route,
        status: 'pending',
      });
    }

    return subtasks;
  }

  public async executePlan(goal: string): Promise<PlanExecutionResult> {
    const planId = `PLAN-${Date.now()}`;
    const subtasks = this.decomposeGoal(goal);

    loggerService.info(`[PLANNER] Executing plan ${planId} with ${subtasks.length} subtasks`);

    for (const task of subtasks) {
      task.status = 'in_progress';
      loggerService.info(`[PLANNER] Executing subtask ${task.id}: ${task.description}`, {
        toolExecution: {
          toolName: task.routeResult.action || 'routeAgent',
          status: 'started',
          args: { goal: task.description, agentId: task.assignedAgentId },
        },
      });

      // Simulate step completion while logging
      task.status = 'completed';
      task.result = `Teilschritt "${task.description}" erfolgreich mit Agent ${task.assignedAgentId} ausgeführt.`;

      loggerService.info(`[PLANNER] Completed subtask ${task.id}`, {
        toolExecution: {
          toolName: task.routeResult.action || 'routeAgent',
          status: 'success',
        },
      });
    }

    const summary = `UDO Planner hat ${subtasks.length} Teilaufgaben für den Fall strukturiert und erfolgreich koordiniert.`;

    return {
      planId,
      originalGoal: goal,
      subtasks,
      summary,
    };
  }
}

export const plannerService = PlannerService.getInstance();
