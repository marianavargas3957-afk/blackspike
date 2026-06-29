// 핵심 로직
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blackspike Ltd website loaded');
    
    // 네비게이션 활성화
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // 스크롤 애니메이션
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = '#0a0a0a';
        } else {
            header.style.backgroundColor = '#0d0d0d';
        }
    });

    // Hero Section 3D Animation (Three.js)
    const initHeroAnimation = () => {
        const canvas = document.querySelector('#hero-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        // 안개 효과 추가로 깊이감 향상
        scene.fog = new THREE.FogExp2(0x0f0f0f, 0.03);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 고해상도 디스플레이에서 선명도 유지 및 성능 최적화

        // 풍선 생성 함수 (더 선명하고 다양한 크기)
        const createBalloon = (color, x, y, z, scale) => {
            const geometry = new THREE.SphereGeometry(1, 32, 32); // 세그먼트 증가로 매끄럽게
            const material = new THREE.MeshStandardMaterial({ 
                color: color,
                roughness: 0.4,
                metalness: 0.1,
                transparent: true,
                opacity: 0.9
            });
            const balloon = new THREE.Mesh(geometry, material);
            balloon.position.set(x, y, z);
            balloon.scale.set(scale, scale, scale);
            
            // 각 풍선에 랜덤한 속도 부여
            balloon.userData = {
                speedY: 0.002 + Math.random() * 0.005,
                speedX: (Math.random() - 0.5) * 0.002,
                speedZ: (Math.random() - 0.5) * 0.005, // Z 축 이동 속도
                rotationSpeed: (Math.random() - 0.5) * 0.01
            };
            
            scene.add(balloon);
            return balloon;
        };

        const balloons = [];
        const colors = [0xff6b6b, 0x4ecdc4, 0xffd93d, 0x6c5ce7, 0xff9ff3];
        
        // 풍선 다수 생성
        for (let i = 0; i < 20; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = (Math.random() - 0.5) * 15;
            const y = (Math.random() - 0.5) * 10 - 2;
            const z = (Math.random() - 0.5) * 10 - 5; // 초기 Z 위치 다양화
            const scale = 0.5 + Math.random() * 1.5;
            balloons.push(createBalloon(color, x, y, z, scale));
        }

        // 조명 추가 (풍선 입체감 강조)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(0xff6b6b, 0.5);
        pointLight2.position.set(-5, -5, -2);
        scene.add(pointLight2);

        camera.position.z = 5;

        // 애니메이션 루프
        const animate = () => {
            requestAnimationFrame(animate);

            balloons.forEach(balloon => {
                // Y 축으로 떠오르는 움직임
                balloon.position.y += balloon.userData.speedY;
                // X 축으로 흔들리는 움직임
                balloon.position.x += balloon.userData.speedX;
                // Z 축으로 앞뒤로 움직이는 움직임 (입체감)
                balloon.position.z += balloon.userData.speedZ;

                // 제자리 회전
                balloon.rotation.y += balloon.userData.rotationSpeed;
                balloon.rotation.x += balloon.userData.rotationSpeed * 0.5;

                // 화면 밖으로 나가면 반대편 아래에서 다시 나타나게 (무한 루프)
                if (balloon.position.y > 8) {
                    balloon.position.y = -8;
                    balloon.position.x = (Math.random() - 0.5) * 15;
                    balloon.position.z = (Math.random() - 0.5) * 10 - 5;
                }
                // Z 축 범위 제한 (너무 가까워지거나 멀어지지 않게)
                if (balloon.position.z > 5 || balloon.position.z < -15) {
                    balloon.userData.speedZ *= -1;
                }
            });

            // 카메라가 살짝 움직여 역동성 추가
            camera.position.x = Math.sin(Date.now() * 0.0005) * 1;
            camera.position.y = Math.cos(Date.now() * 0.0005) * 0.5;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // 리사이즈 처리
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    if (typeof THREE !== 'undefined') {
        initHeroAnimation();
    } else {
        console.warn('Three.js not loaded');
    }
});
