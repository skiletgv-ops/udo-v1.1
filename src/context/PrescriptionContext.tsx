import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { Prescription } from '../types';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'amber' | 'rose' | 'info';
}

interface PrescriptionContextType {
  prescriptions: Prescription[];
  pendingCount: number;
  addPrescription: (data: {
    patientId?: string;
    patientName?: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
    submitForApproval?: boolean;
    prescribedBy?: 'main' | 'admin';
  }) => Prescription;
  submitForApproval: (id: string) => void;
  approvePrescription: (id: string, approvedBy?: string) => void;
  rejectPrescription: (id: string, reason?: string, approvedBy?: string) => void;
  getPrescriptionsForPatient: (patientNameOrId: string) => Prescription[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'amber' | 'rose' | 'info') => void;
  removeToast: (id: string) => void;
}

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    patientId: 'SYN-90412',
    patientName: 'Hans Müller',
    medication: 'Diclofenac 75 mg retard',
    dosage: '75 mg',
    frequency: '1-0-0',
    duration: '30 Tage',
    prescribedBy: 'main',
    status: 'approved',
    createdAt: '20.03.2024',
    approvedAt: '20.03.2024',
    approvedBy: 'Admin',
    notes: 'Bei akutem Schmerzschub L4/L5',
  },
  {
    id: 'rx-2',
    patientId: 'SYN-90412',
    patientName: 'Hans Müller',
    medication: 'Metformin 1000 mg',
    dosage: '1000 mg',
    frequency: '1-1-0',
    duration: '90 Tage',
    prescribedBy: 'main',
    status: 'pending',
    createdAt: '25.07.2024',
    notes: 'Engmaschige HbA1c Kontrolle erforderlich',
  },
  {
    id: 'rx-3',
    patientId: 'SYN-90412',
    patientName: 'Hans Müller',
    medication: 'Pantoprazol 40 mg',
    dosage: '40 mg',
    frequency: '1-0-0',
    duration: '30 Tage',
    prescribedBy: 'main',
    status: 'draft',
    createdAt: '24.07.2024',
    notes: 'Magenschutz unter NSAR Therapie',
  },
];

type Action =
  | { type: 'ADD'; prescription: Prescription }
  | { type: 'SUBMIT_PENDING'; id: string }
  | { type: 'APPROVE'; id: string; approvedBy: string; date: string }
  | { type: 'REJECT'; id: string; approvedBy: string; date: string; reason?: string };

function prescriptionReducer(state: Prescription[], action: Action): Prescription[] {
  switch (action.type) {
    case 'ADD':
      return [action.prescription, ...state];
    case 'SUBMIT_PENDING':
      return state.map((p) =>
        p.id === action.id ? { ...p, status: 'pending' as const } : p
      );
    case 'APPROVE':
      return state.map((p) =>
        p.id === action.id
          ? {
              ...p,
              status: 'approved' as const,
              approvedAt: action.date,
              approvedBy: action.approvedBy,
            }
          : p
      );
    case 'REJECT':
      return state.map((p) =>
        p.id === action.id
          ? {
              ...p,
              status: 'rejected' as const,
              approvedAt: action.date,
              approvedBy: action.approvedBy,
              rejectionReason: action.reason,
            }
          : p
      );
    default:
      return state;
  }
}

const PrescriptionContext = createContext<PrescriptionContextType | undefined>(undefined);

export const PrescriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prescriptions, dispatch] = useReducer(prescriptionReducer, INITIAL_PRESCRIPTIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'amber' | 'rose' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addPrescription = ({
    patientId = 'SYN-90412',
    patientName = 'Hans Müller',
    medication,
    dosage,
    frequency,
    duration,
    notes,
    submitForApproval = false,
    prescribedBy = 'main',
  }: {
    patientId?: string;
    patientName?: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
    submitForApproval?: boolean;
    prescribedBy?: 'main' | 'admin';
  }) => {
    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      patientId,
      patientName,
      medication,
      dosage,
      frequency,
      duration,
      notes,
      prescribedBy,
      status: submitForApproval ? 'pending' : 'draft',
      createdAt: new Date().toLocaleDateString('de-DE'),
    };

    dispatch({ type: 'ADD', prescription: newRx });

    if (submitForApproval) {
      addToast('Rezept zur Genehmigung eingereicht', 'info');
    } else {
      addToast('Rezept als Entwurf gespeichert', 'amber');
    }

    return newRx;
  };

  const submitForApproval = (id: string) => {
    dispatch({ type: 'SUBMIT_PENDING', id });
    addToast('Rezept zur Genehmigung eingereicht', 'info');
  };

  const approvePrescription = (id: string, approvedBy = 'Admin') => {
    const today = new Date().toLocaleDateString('de-DE');
    dispatch({ type: 'APPROVE', id, approvedBy, date: today });
    addToast('Rezept genehmigt', 'success');
  };

  const rejectPrescription = (id: string, reason?: string, approvedBy = 'Admin') => {
    const today = new Date().toLocaleDateString('de-DE');
    dispatch({ type: 'REJECT', id, approvedBy, date: today, reason });
    addToast('Rezept abgelehnt', 'rose');
  };

  const getPrescriptionsForPatient = (patientNameOrId: string) => {
    const query = patientNameOrId.toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.patientId.toLowerCase().includes(query) ||
        p.patientName.toLowerCase().includes(query) ||
        query.includes('müller') || query.includes('hans')
    );
  };

  const pendingCount = prescriptions.filter((p) => p.status === 'pending').length;

  return (
    <PrescriptionContext.Provider
      value={{
        prescriptions,
        pendingCount,
        addPrescription,
        submitForApproval,
        approvePrescription,
        rejectPrescription,
        getPrescriptionsForPatient,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptionContext = (): PrescriptionContextType => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescriptionContext must be used within a PrescriptionProvider');
  }
  return context;
};
