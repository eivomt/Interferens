let slider = document.getElementById("pSlider")
slider.min = 0
slider.max = 1
slider.step = .01

function setup () {
    createCanvas(windowWidth, windowHeight)
    background(230)

    // Numerical grid parameters
    // Lx = windowWidth
    // Lp = 10

    // Numerical inputs
    L = 75
    Nx = 3000
    Nt = 200
    tMax = 20
    p1 = .9
    slider.value = p1
    p2 = 1 - p1

    // Physical inputs
    x0 = -40
    p01 = 1
    sigmaP1 = .1
    p02 = -1.25
    sigmaP2 = 0.15
    t = 0.1
    dt = .2
    tFinal = 100

    // Derivatives
    // x = linspace(-L/2, L/2, Nx);
    // t = linspace(0, tMax, Nt);
    sigmaX1 = 1/(2*sigmaP1);
    sigmaX2 = 1/(2*sigmaP2);

    horizontal = (windowHeight < windowWidth) ? true : false

    console.log(math.multiply(x0, math.complex(2,3)))
}

function psiT(x, t, p0, sigmaX) {
    let i = math.complex(0, 1);
    let A = math.complex(math.sqrt(2 * Math.PI * sigmaX**2));
    // let B = i*(t/2*sigmaX**2)
    let B = math.multiply(2, math.pow(sigmaX, 2))
    B = math.divide(t, B)
    B = math.multiply(i, B)
    

    let AB = math.add(A, math.multiply(A, B))
    let norm = math.pow(AB, -0.5)

    // Komplekst denom = (1 + i * t / (2 * sigma^2))
    let denom = math.add(1, math.multiply(i, t / (2 * sigmaX**2)));
    
    // Eksponenten i første eksponentialledd
    let num = -1 * Math.pow(x - p0 * t, 2);
    let exponent1 = math.divide(num, math.multiply(4 * sigmaX**2, denom));
    
    let term1 = math.exp(exponent1);
    let term2 = math.exp(math.multiply(i, p0 * x));
    let term3 = math.exp(math.multiply(math.multiply(i, -1), math.divide((math.multiply(math.pow(p0, 2), t)), 2)));
    
    let psi = math.multiply(norm, term1, term2, term3);
    
    return psi;
}

function draw() {
    if (slider.value != p1) {
        t = 0
        p1 = slider.value
        p2 = 1 - p1
    }
    background(230);
    translate(windowWidth / 2, windowHeight / 2);

    strokeWeight(1);
    noFill();

    const scaleY = -1000 * 3;
    const scaleX = 18

    let psiRe = [];
    let psiIm = [];
    let psiSq = [];


    
    for (let x = -L / 2; x <= L / 2; x += L / Nx) {
        let psi1 = psiT(x-x0, t, p01, sigmaX1);
        let psi2 = psiT(x+x0, t, p02, sigmaX2);

        // Sum wave functions
        let psi = math.add(math.multiply(math.sqrt(p1), psi1), math.multiply(math.sqrt(p2),psi2));

        psiRe.push(psi.re)
        psiIm.push(psi.im)
        psiSq.push(math.pow(math.abs(psi), 2))
    }

    
    beginShape();
    stroke("#fdfdfd");
    strokeWeight(4)
    for (let x = -L / 2, i = 0; x <= L / 2; x += L / Nx, i++){
        horizontal ? point(x* scaleX,-1 *scaleY * psiRe[i] *.25) : point(-1 *scaleY * psiRe[i] * .25, x* scaleX)
    }
    endShape();
    
    beginShape();
    stroke("#FC4120");
    strokeWeight(8)
        for (let x = -L / 2, i = 0; x <= L / 2; x += L / Nx, i++){
            horizontal ? point(x* scaleX,scaleY * psiSq[i]) : point(scaleY * psiSq[i], x* scaleX)
        }
    endShape();


    t += dt;
    if (t > tFinal) {
        t=0
    }
    translate(-windowWidth / 2, -windowHeight / 2);
}


