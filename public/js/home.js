document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('imgCarrousel');
    const p = document.getElementById('pCarrousel');

    const frases = [
        "Saca tus turnos médicos de manera fácil y rápida.",
        "Encuentra especialistas de confianza cerca de ti.",
        "Programa tus consultas sin complicaciones.",
        "Consulta los horarios y elige el que más te convenga.",
        "Accede a la atención médica que necesitas.",
        "Mantén el control de tus citas en un solo lugar.",
        "Reserva tu turno en cualquier momento, sin esperas."
    ];

    let currentIndex = 0;

    function updateCarrousel(index) {
        img.src = `http://localhost:3000/img/${index + 1}.jpg`;
        p.innerHTML = frases[index];
    }

    setInterval(() => {
        currentIndex = (currentIndex + 1) % frases.length;
        updateCarrousel(currentIndex);
    }, 5000);
});