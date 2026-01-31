// Three.js Hero 3D Scene - Floating Shapes Around Text
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // PERFORMANCE: Detect mobile for reduced quality
    const isMobile = window.innerWidth < 768;
    const maxPixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isMobile // Disable antialiasing on mobile
    });
    renderer.setPixelRatio(maxPixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Resize handler
    function resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // Colors - Purple Haze Theme
    const purple = 0x8B5CF6;
    const pink = 0xEC4899;
    const white = 0xFFFFFF;

    // Floating shapes array
    const shapes = [];

    // Create various geometric shapes
    function createShape(geometry, color, x, y, z, scale = 1) {
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7,
            wireframe: true
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.scale.set(scale, scale, scale);
        mesh.userData = {
            originalX: x,
            originalY: y,
            floatSpeed: 0.5 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            rotSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        scene.add(mesh);
        shapes.push(mesh);
        return mesh;
    }

    // Left side shapes
    createShape(new THREE.IcosahedronGeometry(2, 0), purple, -18, 5, 0, 1);
    createShape(new THREE.OctahedronGeometry(1.5), pink, -15, -4, 5, 1);
    if (!isMobile) createShape(new THREE.TetrahedronGeometry(1.2), purple, -20, -2, -5, 1);
    if (!isMobile) createShape(new THREE.TorusGeometry(1.5, 0.3, 8, 20), pink, -12, 8, -3, 1);
    if (!isMobile) createShape(new THREE.BoxGeometry(1.5, 1.5, 1.5), purple, -22, 2, 3, 1);

    // Right side shapes
    createShape(new THREE.DodecahedronGeometry(1.8), pink, 18, 4, 0, 1);
    createShape(new THREE.IcosahedronGeometry(1.2, 0), purple, 15, -5, 4, 1);
    if (!isMobile) createShape(new THREE.OctahedronGeometry(1.8), pink, 20, 0, -4, 1);
    if (!isMobile) createShape(new THREE.TorusKnotGeometry(1, 0.3, 50, 8), purple, 14, 7, 2, 0.8);
    if (!isMobile) createShape(new THREE.ConeGeometry(1, 2, 6), pink, 22, -3, -2, 1);

    // Top shapes
    createShape(new THREE.SphereGeometry(1, 8, 8), purple, -5, 12, 0, 1);
    if (!isMobile) createShape(new THREE.RingGeometry(1, 1.5, 16), pink, 5, 11, -2, 1);
    if (!isMobile) createShape(new THREE.OctahedronGeometry(1), purple, 0, 14, 3, 0.8);

    // Bottom shapes
    createShape(new THREE.TetrahedronGeometry(1.5), pink, -8, -10, 2, 1);
    if (!isMobile) createShape(new THREE.BoxGeometry(1.2, 1.2, 1.2), purple, 8, -11, -1, 1);
    if (!isMobile) createShape(new THREE.TorusGeometry(1, 0.2, 8, 16), pink, 0, -12, 0, 1);

    // Corner shapes (desktop only - smaller, further back)
    if (!isMobile) {
        createShape(new THREE.IcosahedronGeometry(0.8, 0), purple, -25, 10, -10, 1);
        createShape(new THREE.OctahedronGeometry(0.8), pink, 25, 10, -10, 1);
        createShape(new THREE.TetrahedronGeometry(0.8), purple, -25, -10, -10, 1);
        createShape(new THREE.DodecahedronGeometry(0.8), pink, 25, -10, -10, 1);
    }

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Animate each shape
        shapes.forEach((shape, index) => {
            // Floating animation
            const floatY = Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.5;
            const floatX = Math.cos(time * shape.userData.floatSpeed * 0.5 + shape.userData.floatOffset) * 0.3;

            shape.position.y = shape.userData.originalY + floatY;
            shape.position.x = shape.userData.originalX + floatX;

            // Rotation
            shape.rotation.x += shape.userData.rotSpeed.x;
            shape.rotation.y += shape.userData.rotSpeed.y;
            shape.rotation.z += shape.userData.rotSpeed.z;

            // Mouse influence - shapes move slightly away from center based on mouse
            const distanceFromCenter = Math.sqrt(
                shape.userData.originalX * shape.userData.originalX +
                shape.userData.originalY * shape.userData.originalY
            );
            const influence = distanceFromCenter * 0.03;

            shape.position.x += mouseX * influence;
            shape.position.y += mouseY * influence * 0.5;
        });

        // Camera subtle movement with mouse
        camera.position.x = mouseX * 2;
        camera.position.y = mouseY * 1;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();
})();
