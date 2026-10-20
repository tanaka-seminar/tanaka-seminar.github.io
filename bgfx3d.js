// ====================
// 背景パーティクル
// スクロール中だけ、ごく微量に揺れる（停止時は完全に静止）
// ====================

(function () {

    if (typeof THREE === "undefined") return;

    const container = document.getElementById("bgfx3d");

    if (!container) return;

    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 0.01);

    const group = new THREE.Group();
    scene.add(group);

    const COUNT = 320;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const colorBlue = new THREE.Color(0x4a5fb8);
    const colorGold = new THREE.Color(0xd9b26a);

    for (let i = 0; i < COUNT; i++) {

        const radius = 6 + Math.random() * 16;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const col = Math.random() < 0.8 ? colorBlue : colorGold;

        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.09,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    function render() {
        renderer.render(scene, camera);
    }

    function resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        render();
    }

    window.addEventListener("resize", resize);
    resize();

    // ---- スクロール中だけ、ごく微量に揺れて自然に止まる ----

    const MAX_WOBBLE = 0.06;   // 最大回転量（ラジアン）＝ごく小さく抑える
    const NUDGE = 0.0012;      // スクロール量に対する反応の強さ
    const EASE = 0.15;         // 目標値へ近づく速さ
    const DECAY = 0.92;        // 目標値が0へ収束する速さ
    const EPSILON = 0.0004;    // これ未満になったら完全停止とみなす

    let currentY = 0;
    let targetY = 0;
    let lastScrollY = window.scrollY;
    let rafId = null;

    function tick() {

        currentY += (targetY - currentY) * EASE;
        targetY *= DECAY;

        group.rotation.y = currentY;
        render();

        if (Math.abs(currentY) > EPSILON || Math.abs(targetY) > EPSILON) {
            rafId = requestAnimationFrame(tick);
        } else {
            group.rotation.y = 0;
            currentY = 0;
            targetY = 0;
            render();
            rafId = null;
        }
    }

    function ensureLoop() {
        if (rafId === null) {
            rafId = requestAnimationFrame(tick);
        }
    }

    window.addEventListener("scroll", function () {

        const y = window.scrollY;
        const delta = y - lastScrollY;
        lastScrollY = y;

        targetY += delta * NUDGE;
        targetY = Math.max(-MAX_WOBBLE, Math.min(MAX_WOBBLE, targetY));

        ensureLoop();

    }, { passive: true });

})();
