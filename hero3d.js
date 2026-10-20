// ====================
// Hero 3D ワイヤーフレーム多面体
// ====================

(function () {

    if (typeof THREE === "undefined") return;

    const container = document.getElementById("hero3d");
    const heroEl = document.querySelector(".hero");

    if (!container || !heroEl) return;

    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;

    const group = new THREE.Group();
    scene.add(group);

    function makeWireframe(radius, detail, color, opacity) {
        const geometry = new THREE.IcosahedronGeometry(radius, detail);
        const edges = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity
        });
        return new THREE.LineSegments(edges, material);
    }

    const outerShape = makeWireframe(2.3, 1, 0x4a5fb8, 0.55);
    const innerShape = makeWireframe(1.4, 0, 0xd9b26a, 0.85);

    innerShape.rotation.set(0.4, 0.3, 0);

    group.add(outerShape);
    group.add(innerShape);

    let mouseX = 0;
    let mouseY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let autoAngle = 0;

    function onPointerMove(e) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouseX = (e.clientX - cx) / cx;
        mouseY = (e.clientY - cy) / cy;
    }

    window.addEventListener("pointermove", onPointerMove);

    function resize() {
        const w = container.clientWidth || heroEl.clientWidth;
        const h = container.clientHeight || heroEl.clientHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    window.addEventListener("resize", resize);
    resize();

    function animate() {
        requestAnimationFrame(animate);

        if (document.hidden) return;

        autoAngle += 0.0025;

        tiltX += (mouseY * 0.35 - tiltX) * 0.05;
        tiltY += (mouseX * 0.35 - tiltY) * 0.05;

        group.rotation.x = tiltX;
        group.rotation.y = autoAngle + tiltY;

        outerShape.rotation.z += 0.0006;

        renderer.render(scene, camera);
    }

    animate();

})();
