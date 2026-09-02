import fs from 'fs';
import path from 'path';

const BUCKET_NAME = 'tripple-d-dev.firebasestorage.app';
const AUDIO_DIR = './public/audio';

function getFiles(dir, fileList = []) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            getFiles(fullPath, fileList);
        } else if (item.isFile() && item.name.endsWith('.mp3')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

async function checkIfFileExists(encodedName) {
    try {
        const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodedName}?alt=media`;
        const res = await fetch(url, { method: 'HEAD' });
        return res.status === 200;
    } catch {
        return false;
    }
}

async function uploadFileWithRetry(filePath, retries = 3) {
    const relativePath = path.relative('./public', filePath).replace(/\\/g, '/');
    const encodedName = encodeURIComponent(relativePath);
    const exists = await checkIfFileExists(encodedName);
    if (exists) {
        console.log(`⏩ Пропущен (уже есть): ${relativePath}`);
        return;
    }

    const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o?uploadType=media&name=${encodedName}`;
    const fileBuffer = fs.readFileSync(filePath);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'audio/mpeg' },
                body: fileBuffer,
            });

            if (res.ok) {
                console.log(`✅ Загружен: ${relativePath}`);
                return;
            } else {
                const err = await res.text();
                console.error(`⚠️ Ошибка [попытка ${attempt}/${retries}] ${relativePath}:`, err);
            }
        } catch (e) {
            console.warn(`⏳ Сбой сети (${e.message}), повтор через 1 сек... [попытка ${attempt}/${retries}]`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    console.error(`❌ Не удалось загрузить: ${relativePath}`);
}

async function start() {
    const files = getFiles(AUDIO_DIR);
    console.log(`Найдено ${files.length} файлов. Возобновляем загрузку...`);
    for (let i = 0; i < files.length; i++) {
        console.log(`[${i + 1}/${files.length}]`);
        await uploadFileWithRetry(files[i]);
    }
    console.log('\n🎉 Все файлы успешно загружены в Firebase Storage!');
}

start();