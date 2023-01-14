// preload.js
const { contextBridge, ipcRenderer } = require('electron')

// All the Node.js APIs are available in the preload process.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }


    console.log(process.versions)
    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

contextBridge.exposeInMainWorld('electronAPI', {
    handlePaste: (callback) => ipcRenderer.on('update-paste', callback),
    removePasteHanlder: () => ipcRenderer.removeAllListeners('update-paste'),
    setGrade: (grade) => ipcRenderer.send('set-grade', grade)
})