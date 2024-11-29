import "./NotFoundPage.css";
import Typewriter from "typewriter-effect";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1 className="error-title cursor-large">
        <Typewriter
          options={{
            loop: true,
            delay: 500,
            cursor: "|"
          }}
          onInit={(typewriter) => {
            typewriter
                .typeString("404")
                .callFunction(() => {
                    // Change the cursor character to a space
                    const cursorElement = document.querySelector(".cursor-large .Typewriter__cursor");
                    if (cursorElement) {
                        cursorElement.textContent = " "; // Set cursor to a blank space
                    }
                })
                .pauseFor(12500)
                .callFunction(() => {
                    // Optionally restore the cursor back to "|" after the pause
                    const cursorElement = document.querySelector(".cursor-large .Typewriter__cursor");
                    if (cursorElement) {
                        cursorElement.textContent = "|"; // Restore cursor
                    }
                })
                .deleteAll(300)
                .start() 
          }}
        />
      </h1>
      <div className="error-message cursor">
        <Typewriter
          options={{
            loop: true,
            delay: 100,
            cursor: " "
          }}
          onInit={(typewriter) => {
            typewriter
              .pauseFor(2700)
              .callFunction(() => {
                const cursorElement = document.querySelector(".cursor .Typewriter__cursor");
                if (cursorElement) {
                    cursorElement.textContent = "|"; // Restore cursor
                }
              })
              .typeString("You're not suppose to be here. Go back to safety.")
              .pauseFor(2000)
              .deleteAll(100)
              .callFunction(() => {
                const cursorElement = document.querySelector(".cursor .Typewriter__cursor");
                if (cursorElement) {
                    cursorElement.textContent = " "; // Restore cursor
                }
              })
              .pauseFor(3000)
              .start();
          }}
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
