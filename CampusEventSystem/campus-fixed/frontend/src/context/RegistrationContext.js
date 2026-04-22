/* eslint-disable */
/**
 * RegistrationContext
 * ───────────────────
 * Single source of truth for the logged-in student's registrations.
 * Wrap the student section of the app with <RegistrationProvider>.
 * Any child can call useRegistrations() to:
 *   - registrations    → full array of registration objects (populated eventId)
 *   - registeredIds    → Set<string> of event _id strings for O(1) lookups
 *   - loading          → boolean
 *   - error            → string | null
 *   - refresh()        → manually re-fetch from the server
 *   - addRegistration(reg) → optimistically add after successful POST
 *   - isRegistered(eventId) → boolean
 */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  // ── Derive the student ID from localStorage ─────────────
  const getStudentId = () => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      // authController stores id as u.id (from _id), but Login.js only
      // stores { name, email, role } without id — see fix in Login.js below.
      // We support both fields defensively:
      return u._id || u.id || null;
    } catch {
      return null;
    }
  };

  // ── Fetch registrations from backend ────────────────────
  const fetchRegistrations = useCallback(async () => {
    const studentId = getStudentId();
    if (!studentId) {
      setRegistrations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res  = await API.get(`/api/registrations/student/${studentId}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setRegistrations(data);
    } catch (err) {
      console.error('RegistrationContext fetch error:', err);
      setError('Failed to load registrations');
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // ── Derived Set for fast O(1) isRegistered checks ───────
  const registeredIds = new Set(
    registrations.map(r => {
      const eid = r.eventId?._id || r.eventId;
      return eid ? eid.toString() : null;
    }).filter(Boolean)
  );

  // ── Optimistic add after successful POST ─────────────────
  const addRegistration = (newReg) => {
    setRegistrations(prev => [newReg, ...prev]);
  };

  // ── Public helper ────────────────────────────────────────
  const isRegistered = (eventId) => {
    if (!eventId) return false;
    return registeredIds.has(eventId.toString());
  };

  return (
    <RegistrationContext.Provider value={{
      registrations,
      registeredIds,
      loading,
      error,
      refresh: fetchRegistrations,
      addRegistration,
      isRegistered,
    }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistrations() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistrations must be used within RegistrationProvider');
  return ctx;
}
