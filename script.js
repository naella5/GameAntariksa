let jawabanBenar;
let currentScore = 0;
let soalLevelSaatIni = 1; 
let soalDikerjakan = 0; 
const SOAL_PER_LEVEL = 5; 

// VARIABEL UNTUK TIMER DAN KESULITAN
let timerInterval;
const WAKTU_DASAR = 10; // Waktu awal (Level 1)
const PENGURANGAN_PER_LEVEL = 1; 
const WAKTU_MINIMAL = 5; 
let waktuSisa = WAKTU_DASAR;

// --- Fungsi Utilitas ---
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playAudio(id) {
    const audio = document.getElementById(id);
    // Tambahkan URL audio yang valid jika Anda ingin suara berfungsi
    // Contoh: audio.src = 'URL_AUDIO_ANDA'; 
    if (audio && audio.src) { 
        audio.currentTime = 0; 
        audio.play().catch(e => console.log("Audio playback failed:", e)); 
    }
}

function showFeedback(message, color) {
    const hasilElement = document.getElementById("hasil");
    if (!hasilElement) return;

    hasilElement.classList.remove('animate-correct', 'animate-wrong');
    hasilElement.innerText = message;
    hasilElement.style.color = color;
}

function drawProgress() {
    const container = document.getElementById("progress-container");
    if (!container) return;
    
    container.innerHTML = ''; 

    for (let i = 0; i < SOAL_PER_LEVEL; i++) {
        const dot = document.createElement('div');
        dot.classList.add('progress-dot');
        
        if (i < soalDikerjakan) { 
            dot.classList.add('completed');
        }
        container.appendChild(dot);
    }
}

// --- FUNGSI UPDATE TAMPILAN (MEMPERBAIKI MASALAH LEVEL) ---
function updateTampilan() {
    const idSkor = document.getElementById("skor");
    if (idSkor) idSkor.innerText = currentScore;
    
    // --- Logika Penamaan Level ---
    let levelName = "";
    if (soalLevelSaatIni === 1) levelName = "Pelatihan Astronaut";
    else if (soalLevelSaatIni === 2) levelName = "Navigasi Asteroid";
    else if (soalLevelSaatIni === 3) levelName = "Ekspedisi Galaksi";
    else if (soalLevelSaatIni === 4) levelName = "Penjelajahan Alam Semesta";
    else levelName = `Misi Kosmik Level ${soalLevelSaatIni}`;

    // MENARGETKAN ID LEVEL YANG ADA DI HTML BARU
    const levelElement = document.getElementById("level-info");
    if (levelElement) {
        // Gabungkan LEVEL X dengan nama level
        levelElement.innerText = `LEVEL ${soalLevelSaatIni}: ${levelName}`;
    }
    // ----------------------------

    const idSoalInfo = document.getElementById("soal-info");
    const idJawaban = document.getElementById("jawabanSiswa");
    
    if (idSoalInfo) {
        const soalKe = soalDikerjakan + 1;
        idSoalInfo.innerText = `Soal ke-${soalKe} dari ${SOAL_PER_LEVEL}`;
    }
    
    if (idJawaban) idJawaban.focus();
    drawProgress(); 
}

// --- FUNGSI UTAMA TIMER ---
function startTimer() {
    clearInterval(timerInterval); 
    
    const penguranganTotal = (soalLevelSaatIni - 1) * PENGURANGAN_PER_LEVEL;
    const waktuMaksimalLevel = Math.max(WAKTU_MINIMAL, WAKTU_DASAR - penguranganTotal);
    
    let waktuSisaLokal = waktuMaksimalLevel;
    const timerDisplay = document.getElementById("timer");
    
    if (timerDisplay) timerDisplay.innerText = waktuMaksimalLevel.toFixed(1);

    timerInterval = setInterval(() => {
        waktuSisaLokal = Math.max(0, waktuSisaLokal - 0.1); 
        waktuSisa = waktuSisaLokal; 
        
        if (timerDisplay) timerDisplay.innerText = waktuSisaLokal.toFixed(1);

        // Efek visual kritis
        if (timerDisplay) {
            if (waktuSisaLokal <= 3.0 && waktuSisaLokal > 0) {
                timerDisplay.classList.add('critical');
            } else {
                timerDisplay.classList.remove('critical');
            }
        }
        
        if (waktuSisaLokal <= 0.1) { 
            clearInterval(timerInterval);
            if (timerDisplay) timerDisplay.innerText = "0.0";
            const mainButton = document.querySelector('.main-button');
            if (mainButton) mainButton.disabled = true;
            playAudio('sound-wrong');
            
            // LOGIKA HUKUMAN
            soalDikerjakan = 0; 
            showFeedback("❌ WAKTU HABIS! Mengulang Misi Level Ini...", "rgb(255, 0, 0)");

            setTimeout(buatPersamaanBaru, 2500);
        }
    }, 100); 
}


// --- Fungsi Pembuatan Soal ---
function generateSoal(level) {
    let persamaanText = '';
    jawabanBenar = getRandomInt(2, 15); 
    
    if (level === 1) { // Penjumlahan/Pengurangan Sederhana
        const angkaB = getRandomInt(5, 15);
        if (Math.random() < 0.5) {
            const angkaC = jawabanBenar + angkaB;
            persamaanText = `X + ${angkaB} = ${angkaC}`;
        } else {
            const angkaC = jawabanBenar - angkaB;
            persamaanText = `X - ${angkaB} = ${angkaC}`;
        }

    } else if (level === 2) { // Perkalian/Pembagian Sederhana
        const angkaA = getRandomInt(2, 6);
        
        if (Math.random() < 0.5) {
            const angkaC = angkaA * jawabanBenar;
            persamaanText = `${angkaA}X = ${angkaC}`;
        } else {
            // Pastikan hasil bagi bilangan bulat
            while (jawabanBenar % angkaA !== 0) { 
                 jawabanBenar = getRandomInt(2, 15);
            }
            const angkaC = jawabanBenar / angkaA;
            persamaanText = `X / ${angkaA} = ${angkaC}`;
        }

    } else { // Campuran (Level 3 ke atas)
        const angkaA = getRandomInt(2, 5);
        const angkaB = getRandomInt(3, 20);
        
        if (Math.random() < 0.5) {
             const angkaC = (angkaA * jawabanBenar) + angkaB;
            persamaanText = `${angkaA}X + ${angkaB} = ${angkaC}`;
        } else {
            const angkaC = (angkaA * jawabanBenar) - angkaB;
            persamaanText = `${angkaA}X - ${angkaB} = ${angkaC}`;
        }
    }
    
    const persamaanElement = document.getElementById("persamaan");
    const jawabanSiswaElement = document.getElementById("jawabanSiswa");
    const mainButton = document.querySelector('.main-button');
    
    if (persamaanElement) persamaanElement.innerText = persamaanText;
    if (jawabanSiswaElement) jawabanSiswaElement.value = '';
    if (mainButton) mainButton.disabled = false;
    
    showFeedback("Hitung koordinat X dan input jawaban Anda.", "white");
}


function buatPersamaanBaru() {
    generateSoal(soalLevelSaatIni);
    updateTampilan();
    startTimer(); 
}

// --- FUNGSI CEK JAWABAN ---
window.cekJawaban = function() { 
    const mainButton = document.querySelector('.main-button');
    if (mainButton) mainButton.disabled = true;
    
    clearInterval(timerInterval); 

    const tebakan = parseInt(document.getElementById("jawabanSiswa").value);
    const hasilElement = document.getElementById("hasil");

    if (isNaN(tebakan)) {
        if (mainButton) mainButton.disabled = false;
        startTimer();
        showFeedback("Tolong masukkan angka tebakan Anda.", "orange");
        return;
    }

    if (tebakan === jawabanBenar) {
        // JAWABAN BENAR
        let skorBonus = Math.round(waktuSisa * 100);
        let skorTotalSoal = 1000 + skorBonus;
        
        currentScore += skorTotalSoal;
        soalDikerjakan++;
        
        showFeedback(`✔ DATA BENAR! (+${skorTotalSoal} Poin Bonus)`, "rgb(0, 255, 0)"); 
        if (hasilElement) hasilElement.classList.add('animate-correct');
        playAudio('sound-correct'); 
        
        if (soalDikerjakan >= SOAL_PER_LEVEL) {
            // LEVEL UP
            const container = document.querySelector('.container');
            if (container) container.classList.add('levelup');
            
            soalLevelSaatIni++; 
            soalDikerjakan = 0; 
            
            showFeedback(`🌌 MISI BERHASIL! Naik LEVEL! Waktu berkurang! 🌌`, "rgb(0, 200, 255)"); 
            
            setTimeout(() => {
                if (container) container.classList.remove('levelup');
                buatPersamaanBaru();
            }, 2000); 

        } else {
             // Lanjut ke soal baru
             setTimeout(buatPersamaanBaru, 1500); 
        }

    } else {
        // JAWABAN SALAH
        showFeedback("✖ DATA ERROR! Coba lagi!", "rgb(255, 0, 0)"); 
        if (hasilElement) hasilElement.classList.add('animate-wrong');
        playAudio('sound-wrong'); 
        
        // Aktifkan kembali tombol dan timer
        if (mainButton) mainButton.disabled = false;
        startTimer(); 
    }
    updateTampilan();
}


// --- SETUP INICIAL ---
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi awal
    buatPersamaanBaru();
    
    // Menambahkan event listener untuk tombol enter di input
    const inputJawaban = document.getElementById('jawabanSiswa');
    if(inputJawaban) {
        inputJawaban.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                cekJawaban();
            }
        });
    }
});