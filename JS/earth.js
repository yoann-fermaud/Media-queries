let scene;    // SceneObj
let camera;   // CameraObj
let renderer;    // CanvasObj
let hold;    // MouseHoldVar
let lastmousepos = -0.1;    // LastMousePositionVar
let zoom = false;    // ZoomEarthVar
let nav = false;     // NavOutVar
let zoomX;   // CountryPosX
let zoomY;   // CountryPosY
let country_name;    // CountryNameVar
let earth_scale = 0.5;   // EarthRadiusVar
let intro = false;   // IntraPageVar
let night_button = document.querySelector('input');  // NightButtonObj
let night = false;   // NightCheckVar
let day = false;     // DayCheckVar



// Main Function //

function main()
{
    // Select Canvas in HTML and give it load animation //
    let canv = document.querySelector('canvas');
    canv.classList.add("load");

    // Hold Mouse Check //
    addEventListener('mousedown', () => {
        hold = true
        return hold
    })
    addEventListener('mouseup', () => {
        hold = false
        return hold
    })

    addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / innerWidth)
        * 2 - 1
    })

    // ----------------- //

    if (1025 <= screen.width) {
         earth(50, 1, 1);
    }else if (769 <= screen.width <= 1024) {
        earth(60, 1.8, 1.8); 
    }else if(481 <= screen.width <= 768){
        earth(70, 2.2, 2.2);
    }else if(320 <= screen.width <= 480){
        earth(80, 2.8, 2.8);
    }

    // Create Earth //
    const earthgeometry = new THREE.SphereGeometry(earth_scale,256,256);
    const earthmaterial = new THREE.MeshPhongMaterial({});
    const earthmesh = new THREE.Mesh(earthgeometry,earthmaterial);

    scene.add(earthmesh);

    // ----------- //
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientlight);

    // Create point light And Define his position //
    const pointerlight = new THREE.PointLight(0xffffff,1.4);

    pointerlight.position.set(5,3,5);
    scene.add(pointerlight);

    // Create Cloud //
    const cloudgeometry =  new THREE.SphereGeometry(earth_scale + 0.1 ,32,32);

    const cloudmaterial = new THREE.MeshPhongMaterial({
        shininess: 0,
        map: THREE.ImageUtils.loadTexture('texture/earthCloud.png'),
        transparent: true,
    });

    const cloudmesh = new THREE.Mesh(cloudgeometry,cloudmaterial);
    scene.add(cloudmesh);

    // Create Stars //
        const stargeometry =  new THREE.SphereGeometry(64,64,64);

        const starmaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        map: THREE.ImageUtils.loadTexture('texture/galaxy.png'),
        side: THREE.BackSide
    });
    
    const starmesh = new THREE.Mesh(stargeometry,starmaterial);
    scene.add(starmesh);

    // ------------ //

    // Mouse Position //
    const mouse = {
        x: undefined,
        y: undefined
    }
    // _____________________________________________/ Animate Function \_____________________________________________ //

    const animate = () =>{
        
        // Request Every Frame To WebBrowser //
        requestAnimationFrame(animate);

        // Star Mouvement //
        starmesh.rotation.z += 0.0005;

        // -------------- //

        if(zoom == false) {

            // Mouse Earth Movement //
            if (hold == true) {
                if (mouse.x >= -0.5 && mouse.x <= 0.5) {
                    earthmesh.rotation.y -= mouse.x / 20;
                    cloudmesh.rotation.y += mouse.x / 20;
                    lastmousepos = mouse.x

                    if(earthmesh.rotation.y > Math.PI*2){
                        earthmesh.rotation.y = 0;
                    }
                    if(earthmesh.rotation.y < 0){
                        earthmesh.rotation.y = Math.PI*2;
                    }
                }
                else{
                    hold = false
                }
            }

            // Automatic Earth Movement //
            else{

                // Change cloud Opacity depend on day or night //
                if(day){
                    cloudmaterial.opacity = 1;
                }
                else{
                    cloudmaterial.opacity = 0.4;
                }

                // Page Load Camera Zoom //
                if( camera.position.z > 2.1){
                    camera.position.z -= 0.06;
                }

                // Show Every Element On Screen //
                else{
                    if(intro == false)
                    {
                        titleAnim();
                        let nav = document.querySelector('.nav-btn');
                        let night = document.querySelector('.label');
                        nav.classList.remove("hide");
                        night.classList.remove("hide");
                        intro = true;
                    }
                }

                // __________________________________/Night Mode\__________________________________ //

                if(night_button.checked == true && night == false){

                    let body = document.querySelector("body");
                    let html = document.querySelector("html");

                    body.classList.add("hide")
                    nav = false;

                    setTimeout(() => {
                        earthmesh.material = new THREE.MeshPhongMaterial({
                            shininess: 0,
                            map: THREE.ImageUtils.loadTexture('texture/snapbuilder_night.png'),
                            specularMap: THREE.ImageUtils.loadTexture('texture/map/map_spec.png'),
                            displacementMap: THREE.ImageUtils.loadTexture('texture/map/map_dis.png'),
                            displacementScale: 0.15,
                        });

                        starmaterial.opacity = 1;
                        ambientlight.intensity = 0;
                        pointerlight.intensity = 0.5;
                        pointerlight.position.set(-5,3,5);
                        night = true;
                        day = false;
                     }, 200);
                    
                    setTimeout(() => {
                        body.classList.remove("hide")
                        html.classList.add("dark")
                    }, 500);
                }
                if(night_button.checked == false && day == false){

                    let body = document.querySelector("body");
                    let html = document.querySelector("html");

                    body.classList.add("hide")
                    nav = false;

                    setTimeout(() => {
                        earthmesh.material = new THREE.MeshPhongMaterial({
                            shininess: 0,
                            map: THREE.ImageUtils.loadTexture('texture/snapbuilder.png'),
                            specularMap: THREE.ImageUtils.loadTexture('texture/map/map_spec.png'),
                            displacementMap: THREE.ImageUtils.loadTexture('texture/map/map_dis.png'),
                            displacementScale: 0.15,
                        });

                        starmaterial.opacity = 0.3;
                        ambientlight.intensity = 0.1;
                        pointerlight.position.set(5,3,5);
                        pointerlight.intensity = 1.2;
                        night = false;
                        day = true;
                     }, 200);

                    setTimeout(() => {
                        body.classList.remove("hide")
                        html.classList.remove("dark")
                    }, 500);
                }
                // __________________________________/Night Mode\__________________________________ //
               
                // Check If Nav-Bar Out //
                if(nav == true){
                    if( camera.position.x <= 0.5){
                        camera.position.x += 0.01;
                    }
                    let title = document.querySelector('.ml2');
                    title.classList.add("hide");

                    let night = document.querySelector('label');
                    night.classList.add("nav");
                }
                if(nav == false){
                    if( camera.position.x >= 0){
                        camera.position.x -= 0.01;
                    }
                    let title = document.querySelector('.ml2');
                    title.classList.remove("hide");

                    let night = document.querySelector('label');
                    night.classList.remove("nav");
                }

                // Replace Earth and Camera after a Zoom //
                if( camera.position.z <= 2){
                    camera.position.z += 0.02;
                }  
                if( earthmesh.rotation.x >= 0){
                    earthmesh.rotation.x -= 0.01;
                }

                // Idle Animation Depend of Last rotation //
                if(lastmousepos < 0){
                    earthmesh.rotation.y += 0.001;
                    cloudmesh.rotation.y -= 0.0005;

                    if(earthmesh.rotation.y > Math.PI*2){
                        earthmesh.rotation.y = 0;
                    }

                    if( camera.position.z <= 2){
                        camera.position.z += 0.02;
                    }
                }
                else{
                    earthmesh.rotation.y -= 0.001;
                    cloudmesh.rotation.y += 0.0005;

                    if(earthmesh.rotation.y < 0){
                        earthmesh.rotation.y = Math.PI*2;
                    }
                }
            }
        }
        // __________________________________/Zoom Country\__________________________________ //
        else{
            // Remove Nav Bar //
            nav = false;

            // Camera Center //
            if( camera.position.x >= 0){
                camera.position.x -= 0.03;
            }

            // ----------- //

            if( earthmesh.rotation.y  >= zoomX-0.025 && earthmesh.rotation.y <= zoomX+0.025){       // Check Country X Position
                
                if( earthmesh.rotation.x  >= zoomY-0.1 && earthmesh.rotation.x <= zoomY+0.1){       // Check Country Y Position
                    
                    if( camera.position.z <= 0.8){      // Check Camera Zoom   
                        
                        if( cloudmaterial.opacity <= 0.3){      // Check Cloud Opacity   
                            cloudmesh.rotation.y += 0.0002;     // Change Cloud Mouvement  
                        }
                        
                        else{
                            cloudmaterial.opacity -= 0.03;      // Change Cloud Opacity 
                            show_country_info();        // Show Country Window
                        }
                    }
                    else{
                        camera.position.z -= 0.03;      // Camera Zoom
                    }
                }
                else{
                    earthmesh.rotation.x += 0.04;       // Change EarthMesh Y Position
                }
            }
            else{
                 // Check If EarthMesh rotation is < or > To Sphere radius and if so reset it (Make Coordonates much easyer to setup, And make negative Coordonates non existant) //
                if(earthmesh.rotation.y > Math.PI*2){
                    earthmesh.rotation.y = 0;
                }
                if(earthmesh.rotation.y < 0){
                    earthmesh.rotation.y = Math.PI*2;
                }
                earthmesh.rotation.y -= 0.04;   // Change EarthMesh X Position

                // ------------------------------------------------------------ Can be find in the idle section too ------------------------------------------------------------ // 
            }
        }
        // __________________________________/Zoom Country\__________________________________ //

        // call Render Every Frame //
        render();
    }

// _____________________________________________/ Animate Function \_____________________________________________ //

    // Render Function //
    const render = () => {
        renderer.render(scene,camera);
    }

    // call Animate Function //
    animate();
}

function earth(camValue, xSize, ySize){
    // Setup Canvas and Camera for Render //

    const canvas = document.querySelector('#c');

    camera = new THREE.PerspectiveCamera(camValue, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 10;

    scene = new THREE.Scene();
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true,});
    renderer.setSize(window.innerWidth/xSize, window.innerHeight/ySize);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    renderer.setClearColor(0x00000, 0.0);
}

// Load Main Function on Load //

window.onload = main;

// ------------------------- //

// ____________________/ Nav OUT \____________________ //
function nav_out() 
{
    if(nav == false){
        nav = true;
    }
    else{
        nav = false;
    }
}
// ____________________/ Nav OUT \____________________ //

// _____________________________________________/ Title Animation \_____________________________________________ //
function titleAnim(){
    anime.timeline({loop: false})
}