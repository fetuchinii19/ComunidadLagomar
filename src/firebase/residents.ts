'use client';
import {
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking
} from '@/firebase/non-blocking-updates';
import { collection, doc, Firestore } from 'firebase/firestore';
import type { Resident } from '@/app/lib/definitions';

export function addResident(firestore: Firestore, residentData: Omit<Resident, 'id'>) {
    const residentsCol = collection(firestore, 'residents');
    addDocumentNonBlocking(residentsCol, residentData);
}

export function updateResident(firestore: Firestore, id: string, residentData: Omit<Resident, 'id'>) {
    const residentRef = doc(firestore, 'residents', id);
    updateDocumentNonBlocking(residentRef, residentData);
}

export function deleteResident(firestore: Firestore, id: string) {
    const residentRef = doc(firestore, 'residents', id);
    deleteDocumentNonBlocking(residentRef);
}