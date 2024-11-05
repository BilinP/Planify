import  { useState } from 'react';
import TypingEffect from 'react-typing-effect';
import '../css/NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="backdrop">
            <h1 className="error-title">
                <TypingEffect
                    text={["404"]}
                    speed={300}
                    eraseSpeed={50}
                    eraseDelay={4000}
                    cursorRenderer={(cursor) => <span className="cursor-large">{cursor}</span>}
                    displayTextRenderer={(text) => (
                        <span>
                            {text.split("").map((char, i) => (
                                <span key={i}>{char}</span>
                            ))}
                        </span>
                    )}
                />
            </h1>
            <p className="error-message">
                <TypingEffect
                    text={["You're not supposed to be here. Go back to safety."]}
                    speed={200}
                    eraseSpeed={30}
                    eraseDelay={4000}
                    cursorRenderer={(cursor) => <span className="cursor">{cursor}</span>}
                />
            </p>
        </div>
    );
};

export default NotFoundPage;