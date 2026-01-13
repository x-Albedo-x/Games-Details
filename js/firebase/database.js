import { setDoc, getDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js"
import { db } from "./firebase.js" 

export const addUser = async (nombre, userid) => {
    await setDoc(doc(db, 'usuarios', userid), {nombre, gamelist: []})
}

export const updateUser = async (userid, newData) => {
    const user = doc(db, 'usuarios', userid)
    await updateDoc(user, newData)
}

export const deleteUserDoc = async (userid) => {
    const user = doc(db, 'usuarios', userid)
    await deleteDoc(user)
}

export const getUserList = async (userid) => {
    const docsnap = await getDoc(doc(db, 'usuarios', userid))

    if (docsnap.exists()) {
        return (docsnap.data().gamelist)
    }
}

export const getUserName = async (userid) => {
    const docsnap = await getDoc(doc(db, 'usuarios', userid))

    if (docsnap.exists()) {
        return (docsnap.data().nombre)
    }
}

export const getUser = async (userid) => {
    const docsnap = await getDoc(doc(db, 'usuarios', userid))

    if (docsnap.exists()) {
        return (docsnap.data())
    }
}