// Persistencia do Projeto 200 (cadastros de pastores, formularios, batismos, sorteios...).
// Grava tudo no Firestore quando configurado; senao, no localStorage.
import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

const KEY = "crm200:data:v13";
const COL = "projeto200";
const DOC = "estado";

export async function load() {
  if (db) {
    try {
      const snap = await getDoc(doc(db, COL, DOC));
      if (snap.exists() && snap.data().payload) return snap.data().payload;
    } catch (e) {
      console.warn("Falha ao ler do Firestore, usando dados locais:", e);
    }
  }
  try {
    const r = localStorage.getItem(KEY);
    if (r) return JSON.parse(r);
  } catch (e) {}
  return null;
}

export async function persist(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  if (db) {
    try {
      await setDoc(doc(db, COL, DOC), { payload: d, updatedAt: Date.now() });
    } catch (e) {
      console.warn("Falha ao gravar no Firestore:", e);
    }
  }
}
