import * as THREE from 'three';

/**
 * Módulo para gerenciar a renderização e aplicação dos nomes nas partes brancas do peito dos robôs 3D.
 */
export class RoboChestNameManager {
    constructor() {
        this.canvasWidth = 1024;
        this.canvasHeight = 512;
    }

    /**
     * Cria uma textura dinâmica com o nome do robô (Robotoc ou Vegatocnyx)
     * @param {string} nameText - O nome do robô a ser renderizado
     * @returns {THREE.CanvasTexture} Textura pronta para Three.js
     */
    createTexture(nameText) {
        const canvas = document.createElement('canvas');
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        const ctx = canvas.getContext('2d');

        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Configuração de fonte robusta e moderna
        ctx.font = '900 68px "Segoe UI", Roboto, Helvetica, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // 1. Efeito de Sombra / Brilho Externo (Glow Futurista Ciano)
        ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 2. Gradiente Metálico Interno para o Texto
        const gradient = ctx.createLinearGradient(0, centerY - 40, 0, centerY + 40);
        gradient.addColorStop(0, '#111111');
        gradient.addColorStop(0.5, '#222222');
        gradient.addColorStop(1, '#000000');

        ctx.fillStyle = gradient;
        ctx.fillText(nameText, centerX, centerY);

        // 3. Linha de contorno fina em ciano neon para destaque perfeito
        ctx.shadowBlur = 0;
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00f0ff';
        ctx.strokeText(nameText, centerX, centerY);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    /**
     * Aplica a textura no material correspondente ao peito do modelo 3D
     * @param {THREE.Object3D} model - O modelo 3D carregado
     * @param {string} robotName - Nome do robô ("Robotoc" ou "Vegatocnyx")
     */
    applyToModel(model, robotName) {
        const chestTexture = this.createTexture(robotName);

        model.traverse((child) => {
            if (child.isMesh && child.material) {
                const matName = child.material.name ? child.material.name.toLowerCase() : '';
                // Identifica o material da parte do peito ou partes brancas
                if (matName.includes('chest') || matName.includes('peito') || matName.includes('white')) {
                    child.material.map = chestTexture;
                    child.material.roughness = 0.2;
                    child.material.metalness = 0.8;
                    child.material.needsUpdate = true;
                }
            }
        });
    }
}