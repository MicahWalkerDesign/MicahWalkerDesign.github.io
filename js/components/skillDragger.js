/**
 * skillDragger.js
 * Enables drag-and-drop reordering for skill tags.
 * Constrains sorting to within the parent container.
 */

export function initSkillDragger() {
    const draggables = document.querySelectorAll('.skill-tag');
    const containers = document.querySelectorAll('.skill-tags');

    draggables.forEach(draggable => {
        // Enable dragging
        draggable.setAttribute('draggable', 'true');

        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault(); // Allow dropping
            const afterElement = getDragAfterElement(container, e.clientX, e.clientY);
            const draggable = document.querySelector('.dragging');

            // Constraint: Only allow dropping if the draggable belongs to this container
            // OR allow moving between containers? User said: "the skill cant leave its own box"
            // So we must verify the draggable is a child of this container OR we prevent appending if it wasn't originally?
            // Actually, if we just drag DOM elements, they move. 
            // To strictly enforce "can't leave its own box", we should check if the draggable's parent is THIS container.
            // However, dragover fires on the potental drop target. 
            // If we want to strictly enforce it, we can check the draggable's initial parent.
            // But a simpler UX pattern for "sortable list" is usually just letting it happen *within* the list.
            // To prevent moving *between* boxes, we check if the draggable's parent is the same as the current container.

            // Note: 'draggable' is the element being dragged. 
            // If I drag from Box A to Box B, 'container' is Box B.
            // I need to check if draggable.parentElement === container. 
            // Wait, if I'm *over* Box B, I haven't dropped yet. 
            // If I want to prevent visual movement into Box B, I should only do the append logic
            // if the source container matches.

            // Let's store the source container on dragstart?
            // Or just check dynamically.

            // Implementation:
            // We'll trust the user command: "the skill cant leave its own box".
            // So we only allow the reorder logic if we are dragging over the SAME container it started in.

            if (draggable && draggable.parentElement === container) {
                if (afterElement == null) {
                    container.appendChild(draggable);
                } else {
                    container.insertBefore(draggable, afterElement);
                }
            }
        });
    });
}

/**
 * Helper to determine position relative to other elements
 */
function getDragAfterElement(container, x, y) {
    // Select all draggable elements in this container EXCEPT the one currently dragging
    const draggableElements = [...container.querySelectorAll('.skill-tag:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        // Check horizontal overlap since tags are flex-wrap usually, or vertical?
        // They are inline-block / flex items. 
        // We should probably check distance to center.
        // Standard approach for 2D grid/flex-wrap:
        // This simple Y-axis check might be insufficient for a wrapped flex row.
        // Let's try a distance-based approach for 2D.

        // Simple 1D horizontal/vertical check usually looks at offset. 
        // For flex-wrap, we often care about both.
        // Let's stick to standard "closest center" logic.

        // NOTE: This simple implementation is usually for vertical lists. 
        // For wrapped flex items, it can be tricky.
        // Let's try to find the element whose center is closest to the cursor.

        // Distance squared
        const childX = box.left + box.width / 2;
        const childY = box.top + box.height / 2;

        const dist = (x - childX) ** 2 + (y - childY) ** 2;

        if (dist < closest.offset) {
            return { offset: dist, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.POSITIVE_INFINITY }).element;
}
