import { useCallback } from "react";
import { useStoreActions, useStoreState } from "../state/hook-extensions";
import { Grid, Particle } from "../models/sand.model";

export function useFallingSand() {
    const toolbarState = useStoreState((state) => state.toolbar);
    const { gravity, pixelSize, red, green, blue } = toolbarState;
    const { particles, grid } = useStoreState((state) => state.sand);
    const { initialize, update } = useStoreActions((actions) => actions.sand);

    const updateParticles = useCallback(() => {
        console.log("updateParticles called. Current particle count:", particles.length);
        if (particles.length > 0) {
            console.log("Updating particles. Current count:", particles.length);
        }
        const updatedParticles: Particle[] = [];
        let updatedGrid: Grid = grid.map(row => row.map(() => false));

        particles.forEach((particle) => {
            const gridX = Math.floor(particle.x / pixelSize);
            const gridY = Math.floor(particle.y / pixelSize);

            if (gridY < updatedGrid.length - 1 && !updatedGrid[gridY + 1][gridX]) {
                particle.y += gravity * pixelSize;
            } else if (
                gridY < updatedGrid.length - 1 &&
                gridX > 0 &&
                !updatedGrid[gridY][gridX - 1] &&
                !updatedGrid[gridY + 1][gridX - 1]
            ) {
                particle.x -= pixelSize;
                particle.y += gravity * pixelSize;
            } else if (
                gridY < updatedGrid.length - 1 &&
                gridX < updatedGrid[0].length - 1 &&
                !updatedGrid[gridY][gridX + 1] &&
                !updatedGrid[gridY + 1][gridX + 1]
            ) {
                particle.x += pixelSize;
                particle.y += gravity * pixelSize;
            }

            const newGridX = Math.floor(particle.x / pixelSize);
            const newGridY = Math.floor(particle.y / pixelSize);
            console.log("new x, new y", newGridX, newGridY);
            console.log("updatedGrid", updatedGrid);
            updatedGrid[newGridY][newGridX] = true;

            updatedParticles.push(particle);
        });

        if (updatedParticles.length > 0) {
            update({ particles: updatedParticles, grid: updatedGrid });
        }
        return updatedParticles;
    }, [grid, particles, gravity, pixelSize, update]);

    const addNewParticle = useCallback((x: number, y: number) => {
        console.log("Adding new particle at:", x, y);
        const gridX = Math.floor(x / pixelSize);
        const gridY = Math.floor(y / pixelSize);

        const color = `rgb(${red}, ${green}, ${blue})`;
        const newParticle: Particle = {
            x: gridX * pixelSize,
            y: gridY * pixelSize,
            color: color
        };

        const newParticles = [...particles, newParticle];
        update({ particles: newParticles });
        console.log("New particle added. Color:", color, "Total count:", newParticles.length);
    }, [particles, pixelSize, red, green, blue, update]);

    return {
        updateParticles,
        addNewParticle,
        initialize,
        particleCount: particles.length
    };
}