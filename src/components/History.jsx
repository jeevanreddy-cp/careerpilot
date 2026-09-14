import { useEffect, useState } from "react";

function History() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const [completedSteps, setCompletedSteps] = useState([]);

  // Fetch saved roadmaps from the backend
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch(
          "https://careerpilot-d4k4.onrender.com"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch roadmaps");
        }

        const data = await response.json();

        console.log(
          "Roadmaps received from backend:",
          data.roadmaps
        );

        setRoadmaps(data.roadmaps || []);
      } catch (error) {
        console.error("History fetch error:", error);
        setError("Unable to load roadmap history");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  // Open a saved roadmap and load its saved progress
  const handleViewRoadmap = (item) => {
    console.log("Selected roadmap:", item);
    console.log(
      "Saved completed steps:",
      item.completed_steps
    );

    setSelectedRoadmap(item);

    setCompletedSteps(
      Array.isArray(item.completed_steps)
        ? item.completed_steps
        : []
    );
  };

  // Save progress to the backend
  const saveProgress = async (roadmapId, steps) => {
    try {
      console.log("Saving progress:", {
        roadmapId,
        steps,
      });

      const response = await fetch(
        `https://careerpilot-d4k4.onrender.com/api/roadmaps/${id}/progress`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completedSteps: steps,
          }),
        }
      );

      const data = await response.json();

      console.log("Progress API response:", data);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to save progress"
        );
      }

      // Update the selected roadmap with the latest saved progress
      setSelectedRoadmap((previousRoadmap) => {
        if (!previousRoadmap) {
          return previousRoadmap;
        }

        return {
          ...previousRoadmap,
          completed_steps: steps,
        };
      });

      // Also update the roadmap inside the History list
      setRoadmaps((previousRoadmaps) =>
        previousRoadmaps.map((roadmap) =>
          roadmap.id === roadmapId
            ? {
                ...roadmap,
                completed_steps: steps,
              }
            : roadmap
        )
      );

      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Progress save error:", error);
    }
  };

  // Toggle one roadmap step
  const handleStepToggle = (index) => {
    setCompletedSteps((previousSteps) => {
      let updatedSteps;

      if (previousSteps.includes(index)) {
        updatedSteps = previousSteps.filter(
          (stepIndex) => stepIndex !== index
        );
      } else {
        updatedSteps = [
          ...previousSteps,
          index,
        ];
      }

      if (selectedRoadmap?.id) {
        saveProgress(
          selectedRoadmap.id,
          updatedSteps
        );
      }

      return updatedSteps;
    });
  };

  const totalSteps =
    selectedRoadmap?.roadmap?.length || 0;

  const completedCount = completedSteps.length;

  const progressPercentage =
    totalSteps === 0
      ? 0
      : Math.round(
          (completedCount / totalSteps) * 100
        );

  if (loading) {
    return (
      <section className="history-section">
        <h2>Roadmap History</h2>
        <p>Loading your saved roadmaps...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="history-section">
        <h2>Roadmap History</h2>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="history-section">
      <div className="history-heading">
        <p className="roadmap-label">
          YOUR PREVIOUS PLANS
        </p>

        <h2>Roadmap History</h2>

        <p>
          View the career roadmaps you generated previously.
        </p>
      </div>

      {roadmaps.length === 0 ? (
        <div className="history-empty">
          <h3>No roadmaps yet</h3>

          <p>
            Generate your first personalized roadmap to see
            it here.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {roadmaps.map((item) => (
            <div
              className="history-card"
              key={item.id}
            >
              <div className="history-card-top">
                <div>
                  <p className="history-date">
                    {new Date(
                      item.created_at
                    ).toLocaleDateString()}
                  </p>

                  <h3>{item.career_goal}</h3>
                </div>

                <span className="history-badge">
                  {item.experience}
                </span>
              </div>

              <div className="history-details">
                <p>
                  <strong>Skill:</strong>{" "}
                  {item.skills}
                </p>

                <p>
                  <strong>Interest:</strong>{" "}
                  {item.interests}
                </p>

                <p>
                  <strong>Weekly Time:</strong>{" "}
                  {item.learning_time}
                </p>
              </div>

              <button
                className="view-roadmap-button"
                onClick={() =>
                  handleViewRoadmap(item)
                }
              >
                View Roadmap
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRoadmap && (
        <div className="selected-roadmap-section">
          <div className="selected-roadmap-heading">
            <div>
              <p className="roadmap-label">
                SAVED ROADMAP
              </p>

              <h2>
                {selectedRoadmap.career_goal}
              </h2>

              <p>
                Generated on{" "}
                {new Date(
                  selectedRoadmap.created_at
                ).toLocaleDateString()}
              </p>
            </div>

            <button
              className="close-roadmap-button"
              onClick={() => {
                setSelectedRoadmap(null);
                setCompletedSteps([]);
              }}
            >
              Close
            </button>
          </div>

          <div className="progress-section">
            <div className="progress-heading">
              <h3>Learning Progress</h3>

              <strong>
                {progressPercentage}%
              </strong>
            </div>

            <div className="progress-bar-background">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progressPercentage}%`,
                }}
              ></div>
            </div>

            <p className="progress-text">
              {completedCount} of {totalSteps} steps
              completed
            </p>
          </div>

          <div className="saved-roadmap-list">
            {selectedRoadmap.roadmap?.map(
              (step, index) => {
                const isCompleted =
                  completedSteps.includes(index);

                return (
                  <div
                    className={`saved-roadmap-step ${
                      isCompleted
                        ? "completed-step"
                        : ""
                    }`}
                    key={index}
                  >
                    <div className="saved-step-number">
                      {isCompleted
                        ? "✓"
                        : index + 1}
                    </div>

                    <div className="saved-step-content">
                      <div className="saved-step-top">
                        <h3>{step.title}</h3>

                        <span>
                          {step.duration}
                        </span>
                      </div>

                      <p>{step.description}</p>

                      <label className="step-checkbox-label">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() =>
                            handleStepToggle(index)
                          }
                        />

                        Mark as completed
                      </label>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default History;