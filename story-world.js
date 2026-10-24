// Shadowline Hunter — story world and 1,112 mission framework
// Safe exploration/story layer. Does not change combat or weapon mechanics.

(() => {
  const TOTAL_MISSIONS = 1112;
  const chapters = [
    ['The Fog-Choked Victorian Quarter', 1, 120],
    ['The Sanguine Cathedral District', 121, 250],
    ['The Old Cemetery', 251, 360],
    ['The Vampire Lord\'s Manor', 361, 500],
    ['The Underground City', 501, 640],
    ['The Forgotten Docks', 641, 770],
    ['The Highland Ruins', 771, 890],
    ['The Ancient Valley', 891, 990],
    ['The Outer Kingdom', 991, 1060],
    ['The Final Shadowline', 1061, 1112]
  ];

  const missionTemplates = [
    'Investigate the district and uncover its hidden story.',
    'Follow the trail through the old streets.',
    'Search the marked location for a story clue.',
    'Meet the local witness and learn what happened.',
    'Reach the next landmark and record your discovery.',
    'Explore the surrounding buildings and find the next clue.',
    'Return to the safe point and report your findings.',
    'Cross the district and locate the next story marker.'
  ];

  function chapterFor(id) {
    return chapters.find(c => id >= c[1] && id <= c[2]) || chapters[0];
  }

  // Missions are generated as data so 1,112 missions do not require 1,112 files.
  const missions = Array.from({ length: TOTAL_MISSIONS }, (_, index) => {
    const id = index + 1;
    const chapter = chapterFor(id);
    return {
      id,
      chapter: chapter[0],
      objective: missionTemplates[index % missionTemplates.length],
      districtMission: id - chapter[1] + 1
    };
  });

  const savedMission = Number(localStorage.getItem('shadowlineCurrentMission') || 1);
  let currentMission = Math.min(Math.max(savedMission, 1), TOTAL_MISSIONS);

  // Give the existing world a much larger camera range without replacing its renderer.
  if (typeof camera !== 'undefined') {
    camera.fov = 78;
    camera.near = 0.08;
    camera.far = 1400;
    camera.updateProjectionMatrix();
  }

  // Story HUD
  const panel = document.createElement('aside');
  panel.id = 'storyPanel';
  panel.innerHTML = `
    <div class="story-kicker">STORY CAMPAIGN</div>
    <div class="story-title">MISSION <strong id="storyMissionNumber">1</strong> / ${TOTAL_MISSIONS}</div>
    <div class="story-chapter" id="storyChapter"></div>
    <div class="story-objective" id="storyObjective"></div>
    <div class="story-progress"><span id="storyProgressBar"></span></div>
    <div class="story-hint">M = WORLD VIEW</div>
  `;
  document.getElementById('game')?.appendChild(panel);

  const missionNumber = document.getElementById('storyMissionNumber');
  const chapterText = document.getElementById('storyChapter');
  const objectiveText = document.getElementById('storyObjective');
  const progressBar = document.getElementById('storyProgressBar');

  function renderMission() {
    const mission = missions[currentMission - 1];
    if (!mission) return;
    missionNumber.textContent = mission.id;
    chapterText.textContent = mission.chapter;
    objectiveText.textContent = mission.objective;
    progressBar.style.width = `${(mission.id / TOTAL_MISSIONS) * 100}%`;
    localStorage.setItem('shadowlineCurrentMission', String(currentMission));
  }

  function setMission(id) {
    currentMission = Math.min(Math.max(Number(id) || 1, 1), TOTAL_MISSIONS);
    renderMission();
  }

  // Expose a tiny story API for future level files.
  window.ShadowlineStory = {
    totalMissions: TOTAL_MISSIONS,
    missions,
    chapters,
    getCurrentMission: () => currentMission,
    setMission,
    completeMission: () => setMission(Math.min(currentMission + 1, TOTAL_MISSIONS))
  };

  // M toggles a static world-view camera. No animated scenery is added.
  let worldView = false;
  let savedCamera = null;
  window.addEventListener('keydown', event => {
    if (event.key.toLowerCase() !== 'm' || event.repeat || typeof camera === 'undefined') return;
    worldView = !worldView;
    if (worldView) {
      savedCamera = {
        position: camera.position.clone(),
        rotation: camera.rotation.clone()
      };
      camera.position.set(0, 110, -30);
      camera.lookAt(0, 0, -70);
      panel.classList.add('world-view');
      panel.querySelector('.story-hint').textContent = 'M = RETURN TO PLAYER VIEW';
    } else if (savedCamera) {
      camera.position.copy(savedCamera.position);
      camera.rotation.copy(savedCamera.rotation);
      panel.classList.remove('world-view');
      panel.querySelector('.story-hint').textContent = 'M = WORLD VIEW';
    }
  });

  renderMission();
  console.log(`Shadowline Hunter story system loaded: ${TOTAL_MISSIONS} missions.`);
})();
