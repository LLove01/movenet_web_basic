import React, { useState, useEffect, useCallback } from 'react';

const ImaginaryRings = ({ width, height, keypoints }) => {
    const [rings, setRings] = useState([]);

    const addRingAtHandPosition = useCallback(() => {
        // Find the position of the hand keypoints (assuming left wrist for simplicity)
        const handKeyPoint = keypoints.find(kp => kp.name === 'left_wrist');
        if (handKeyPoint) {
            const newRing = { x: handKeyPoint.x, y: handKeyPoint.y, id: rings.length + 1 };
            setRings(rings => [...rings, newRing]); // Use functional update to ensure correct current state
        }
    }, [keypoints, rings.length]); // Depend on keypoints and the current number of rings

    useEffect(() => {
        const targetArea = document.getElementById('ring-container');
        if(targetArea) {
            targetArea.addEventListener('click', addRingAtHandPosition);
        }

        return () => {
            if(targetArea) {
                targetArea.removeEventListener('click', addRingAtHandPosition);
            }
        };
    }, [addRingAtHandPosition]); // Now only re-attaches if addRingAtHandPosition changes

    return (
        <div id="ring-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {rings.map(ring => (
                <div key={ring.id} style={{
                    position: 'absolute',
                    left: `${ring.x}px`,
                    top: `${ring.y}px`,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'blue',
                    transition: 'background-color 0.3s',
                }} />
            ))}
        </div>
    );
};

export default ImaginaryRings;
