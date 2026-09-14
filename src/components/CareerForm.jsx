import { useState } from "react";
import Roadmap from "./Roadmap";

function CareerForm() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [learningTime, setLearningTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [backendRoadmap, setBackendRoadmap] = useState([]);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setShowRoadmap(false);

    try {
      const response = await fetch(
        "https://careerpilot-d4k4.onrender.com/api/roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills,
            interests,
            careerGoal,
            education,
            experience,
            learningTime,
          }),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Backend request failed"
        );
      }

      setBackendRoadmap(data.roadmap);
      setShowRoadmap(true);
    } catch (error) {
      console.error(
        "Error generating roadmap:",
        error
      );

      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="career-form"
      >
        <h2>Tell us about yourself</h2>

        <div className="form-group">
          <label htmlFor="skills">Main Skill</label>

          <select
            id="skills"
            value={skills}
            onChange={(event) =>
              setSkills(event.target.value)
            }
            required
          >
            <option value="">
              Select your main skill
            </option>

            <option value="C++">C++</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="JavaScript">
              JavaScript
            </option>
            <option value="HTML and CSS">
              HTML and CSS
            </option>
            <option value="SQL">SQL</option>
            <option value="Data Structures and Algorithms">
              Data Structures and Algorithms
            </option>
            <option value="Communication">
              Communication
            </option>
            <option value="Problem Solving">
              Problem Solving
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="interests">
            Main Interest
          </label>

          <select
            id="interests"
            value={interests}
            onChange={(event) =>
              setInterests(event.target.value)
            }
            required
          >
            <option value="">
              Select your main interest
            </option>

            <option value="Artificial Intelligence">
              Artificial Intelligence
            </option>
            <option value="Machine Learning">
              Machine Learning
            </option>
            <option value="Web Development">
              Web Development
            </option>
            <option value="App Development">
              App Development
            </option>
            <option value="Data Science">
              Data Science
            </option>
            <option value="Cybersecurity">
              Cybersecurity
            </option>
            <option value="Cloud Computing">
              Cloud Computing
            </option>
            <option value="Game Development">
              Game Development
            </option>
            <option value="UI/UX Design">
              UI/UX Design
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="careerGoal">
            Career Goal
          </label>

          <select
            id="careerGoal"
            value={careerGoal}
            onChange={(event) =>
              setCareerGoal(event.target.value)
            }
            required
          >
            <option value="">
              Select your career goal
            </option>

            <option value="AI Engineer">
              AI Engineer
            </option>
            <option value="Machine Learning Engineer">
              Machine Learning Engineer
            </option>
            <option value="Software Developer">
              Software Developer
            </option>
            <option value="Frontend Developer">
              Frontend Developer
            </option>
            <option value="Backend Developer">
              Backend Developer
            </option>
            <option value="Full Stack Developer">
              Full Stack Developer
            </option>
            <option value="Data Scientist">
              Data Scientist
            </option>
            <option value="Cybersecurity Analyst">
              Cybersecurity Analyst
            </option>
            <option value="Cloud Engineer">
              Cloud Engineer
            </option>
            <option value="UI/UX Designer">
              UI/UX Designer
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="education">
            Education Level
          </label>

          <select
            id="education"
            value={education}
            onChange={(event) =>
              setEducation(event.target.value)
            }
            required
          >
            <option value="">
              Select education level
            </option>

            <option value="School Student">
              School Student
            </option>
            <option value="Diploma Student">
              Diploma Student
            </option>
            <option value="Undergraduate Student">
              Undergraduate Student
            </option>
            <option value="Postgraduate Student">
              Postgraduate Student
            </option>
            <option value="Working Professional">
              Working Professional
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="experience">
            Experience Level
          </label>

          <select
            id="experience"
            value={experience}
            onChange={(event) =>
              setExperience(event.target.value)
            }
            required
          >
            <option value="">
              Select experience level
            </option>

            <option value="Beginner">
              Beginner
            </option>
            <option value="Intermediate">
              Intermediate
            </option>
            <option value="Advanced">
              Advanced
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="learningTime">
            Learning Time Per Week
          </label>

          <select
            id="learningTime"
            value={learningTime}
            onChange={(event) =>
              setLearningTime(event.target.value)
            }
            required
          >
            <option value="">
              Select available time
            </option>

            <option value="1-3 hours">
              1–3 hours
            </option>
            <option value="4-7 hours">
              4–7 hours
            </option>
            <option value="8-12 hours">
              8–12 hours
            </option>
            <option value="13+ hours">
              13+ hours
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : "Generate Roadmap"}
        </button>
      </form>

      {showRoadmap && (
        <Roadmap
          skills={skills}
          careerGoal={careerGoal}
          interests={interests}
          education={education}
          experience={experience}
          learningTime={learningTime}
          backendRoadmap={backendRoadmap}
        />
      )}
    </>
  );
}

export default CareerForm;