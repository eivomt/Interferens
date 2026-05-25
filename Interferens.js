// Packet definition
class Packet {
    constructor(x0, dx, SigmaX, p0, amplitude) {
        this.x0 = x0
        this.dx = dx
        this.SigmaX = SigmaX
        this.p0 = p0
        this.amplitude = amplitude
    }

    update() {
        this.x0 += this.dx

        // Reflect at edges
        if (this.x0 > xMax - 500) {
            this.dx = -Math.abs(this.dx)
        } else if (this.x0 < xMin + 500) {
            this.dx = Math.abs(this.dx)
        }
    }

    valueAt(i) {
        // Gaussian * cos carrier
        let gaussian = this.amplitude * (1 / (this.SigmaX * Math.sqrt(2 * Math.PI))) * Math.exp(-1* (i - this.x0) ** 2 / (2 * this.SigmaX ** 2))
        let carrier = Math.cos(this.p0 * i)
        return gaussian * carrier
    }
}

let packets = []

function setup () {
    createCanvas(windowWidth, windowHeight)
    background(230)

    // Numerical grid parameters
    Lx = windowWidth
    Lp = 10
    N = 1001

    // Window fixation values
    xMin = -Lx / 2
    xMax = Lx / 2

    // Create multiple packets
    packets.push(new Packet(0, 4.0, 100, -0.1, 12))
    packets.push(new Packet(0, -4.0, 100, 0.1, 12))
    // packets.push(new Packet(0, 4.0, 50, -0.1, 2))
    // packets.push(new Packet(-0, -4.0, 50, 0.1, 2))
    // packets.push(new Packet(0, 4.0, 20, -0.015, 5))
    // packets.push(new Packet(-0, -4.0, 20, 0.15, 5))
}

drawRed = () => {
    translate(windowWidth / 2, windowHeight / 2)
    noFill()
    stroke("#FC4120")
    beginShape()
    for (let i = xMin; i < xMax; i += 0.5) {
        // Sum of all packets
        let sum = 0
        for (let pkt of packets) {
            sum += pkt.valueAt(i)
        }

        let y = -1 * 700 * sum
        vertex(i, y)
    }
    endShape()
    translate(-windowWidth / 2, -windowHeight / 2)
}

function draw() {
    background(230, 80)
    drawRed()

    // Update packets
    for (let pkt of packets) {
        pkt.update()
    }
}
