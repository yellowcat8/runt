import './style.css'

// 1. Scroll Progress Helper
function getScrollProgress(element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  if (rect.height > windowHeight) {
    const scrollRange = rect.height - windowHeight;
    let progress = -rect.top / scrollRange;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;
    return progress;
  } else {
    // If the element is shorter than the viewport (on mobile stack layout)
    const totalRange = windowHeight + rect.height;
    const currentPos = windowHeight - rect.top;
    let progress = currentPos / totalRange;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;
    return progress;
  }
}

// 2. Main Scroll Listeners
window.addEventListener('scroll', () => {
  // --- SECTION 1: COURSE OCCUPANCY ---
  const occTrack = document.getElementById('track-occupancy');
  if (occTrack) {
    const progress = getScrollProgress(occTrack);
    
    // Update Cues active classes
    updateCues('occ-cue-', progress);
    
    const phoneOcc = document.getElementById('phone-occ');
    const cardOcc = document.getElementById('card-occ');
    
    if (phoneOcc) {
      // Parallax scroll effect for the app screenshot background
      // Pans completely between 0.0 and 0.6 progress
      const panProgress = Math.min(progress / 0.6, 1);
      phoneOcc.style.setProperty('--screen-scroll-y', (panProgress * -15).toString());
    }
    
    // 3D Tilt Phone & Rise Card (occurs from 60% to 85% progress)
    if (progress >= 0.6) {
      // Scale stage from 0 to 1 as progress goes from 0.6 to 0.85
      const stage = Math.min((progress - 0.6) / 0.25, 1);
      
      if (phoneOcc) {
        phoneOcc.style.setProperty('--tilt-x', (stage * 55).toString());
        phoneOcc.style.setProperty('--tilt-z', (stage * 15).toString());
        phoneOcc.style.setProperty('--translate-y', (stage * -15).toString());
      }
      if (cardOcc) {
        cardOcc.style.setProperty('--card-z', (stage * 65).toString());
        cardOcc.style.setProperty('--card-scale', stage.toString());
        cardOcc.style.setProperty('--card-opacity', stage.toString());
        
        // Activate bars inside graph
        const bars = cardOcc.querySelectorAll('.graph-bar');
        bars.forEach(bar => bar.classList.add('active'));
      }
    } else {
      if (phoneOcc) {
        phoneOcc.style.setProperty('--tilt-x', '0');
        phoneOcc.style.setProperty('--tilt-z', '0');
        phoneOcc.style.setProperty('--translate-y', '0');
      }
      if (cardOcc) {
        cardOcc.style.setProperty('--card-z', '0');
        cardOcc.style.setProperty('--card-scale', '0');
        cardOcc.style.setProperty('--card-opacity', '0');
      }
    }
  }

  // --- SECTION 2: CREW MANAGEMENT & BILLING ---
  const crewTrack = document.getElementById('track-crew');
  if (crewTrack) {
    const progress = getScrollProgress(crewTrack);
    
    // Update Cues active classes
    updateCues('crew-cue-', progress);
    
    const phoneCrew = document.getElementById('phone-crew');
    const cardBilling = document.getElementById('card-billing');
    
    if (phoneCrew) {
      // Parallax scroll effect for the app screenshot background
      // Pans completely between 0.0 and 0.6 progress
      const panProgress = Math.min(progress / 0.6, 1);
      phoneCrew.style.setProperty('--screen-scroll-y', (panProgress * -15).toString());
    }
    
    // 3D Tilt Phone & Rise Card (occurs from 60% to 85% progress)
    if (progress >= 0.6) {
      // Scale stage from 0 to 1 as progress goes from 0.6 to 0.85
      const stage = Math.min((progress - 0.6) / 0.25, 1);
      
      if (phoneCrew) {
        phoneCrew.style.setProperty('--tilt-x', (stage * 55).toString());
        phoneCrew.style.setProperty('--tilt-z', (stage * 15).toString());
        phoneCrew.style.setProperty('--translate-y', (stage * -15).toString());
      }
      if (cardBilling) {
        cardBilling.style.setProperty('--card-z', (stage * 65).toString());
        cardBilling.style.setProperty('--card-scale', stage.toString());
        cardBilling.style.setProperty('--card-opacity', stage.toString());
      }
    } else {
      if (phoneCrew) {
        phoneCrew.style.setProperty('--tilt-x', '0');
        phoneCrew.style.setProperty('--tilt-z', '0');
        phoneCrew.style.setProperty('--translate-y', '0');
      }
      if (cardBilling) {
        cardBilling.style.setProperty('--card-z', '0');
        cardBilling.style.setProperty('--card-scale', '0');
        cardBilling.style.setProperty('--card-opacity', '0');
      }
    }
  }
});

// Update Side Cues active state based on ranges
function updateCues(prefix, progress) {
  const cue1 = document.getElementById(prefix + '1');
  const cue2 = document.getElementById(prefix + '2');
  const cue3 = document.getElementById(prefix + '3');
  
  if (!cue1 || !cue2 || !cue3) return;
  
  if (progress < 0.3) {
    cue1.classList.add('active');
    cue2.classList.remove('active');
    cue3.classList.remove('active');
  } else if (progress >= 0.3 && progress < 0.6) {
    cue1.classList.remove('active');
    cue2.classList.add('active');
    cue3.classList.remove('active');
  } else {
    cue1.classList.remove('active');
    cue2.classList.remove('active');
    cue3.classList.add('active');
  }
}

// 3. Stats Section Intersection Count-Up Animation (runt Metrics)
const statsSection = document.querySelector('.stats');
let statsAnimated = false;

function animateValue(obj, start, end, duration, formatFn) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = formatFn(Math.floor(progress * (end - start) + start));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        
        const crewsEl = document.getElementById('stat-crews');
        const cheersEl = document.getElementById('stat-cheers');

        if (crewsEl) animateValue(crewsEl, 0, 1482, 1800, v => v.toLocaleString());
        if (cheersEl) animateValue(cheersEl, 0, 12895, 1500, v => v.toLocaleString());
        
        setTimeout(startLiveIncrements, 2000);
      }
    });
  }, { threshold: 0.15 });
  
  observer.observe(statsSection);
}

function startLiveIncrements() {
  setInterval(() => {
    const el = document.getElementById('stat-cheers');
    if (!el) return;
    let currentVal = parseInt(el.textContent.replace(/,/g, ''));
    if (isNaN(currentVal)) return;
    currentVal += 1;
    el.textContent = currentVal.toLocaleString();
  }, 4000);
}

// 4. Live Activity Feed simulation
const mockActivities = [
  { type: 'book', name: '크루 [러너스하이]', text: '가 반포한강공원 B코스 저녁 8시 예약을 <strong>선점</strong>했습니다. 📅' },
  { type: 'check', name: '김민지', text: '님이 여의도 정기런 모임 <strong>출석체크</strong>를 완료했습니다 (참석확정 ✋).' },
  { type: 'bill', name: '크루 [PaceMakers]', text: '의 뒷풀이 정산이 완료되었습니다 (1인당 <strong>₩6,500 자동정산</strong> 💳).' },
  { type: 'check', name: '박선우', text: '님이 잠실 트랙 번개런에 도착하여 <strong>원터치 출석</strong>을 완료했습니다.' },
  { type: 'book', name: '크루 [남산러너스]', text: '가 남산 둘레길 코스 일요일 오전 예약을 <strong>등록</strong>했습니다.' },
  { type: 'bill', name: '크루 [RunClub]', text: '의 이번 달 회비 <strong>자동정산 분할청구</strong>가 발송되었습니다.' },
  { type: 'book', name: '크루 [뚝섬크루]', text: '가 뚝섬유원지 러닝 구간 예약을 변경하였습니다.' }
];

const feedContainer = document.getElementById('feed-container');
let activityIndex = 0;

function createFeedItem(act) {
  const item = document.createElement('div');
  item.className = 'feed-item';
  
  let icon = '🏃';
  let iconClass = '';
  if (act.type === 'book') {
    icon = '📅';
    iconClass = 'feed-icon--book';
  } else if (act.type === 'check') {
    icon = '✋';
    iconClass = 'feed-icon--check';
  } else if (act.type === 'bill') {
    icon = '💳';
    iconClass = 'feed-icon--bill';
  }
  
  item.innerHTML = `
    <div class="feed-icon ${iconClass}">${icon}</div>
    <div class="feed-content">
      <p class="feed-text"><strong>${act.name}</strong>${act.text}</p>
    </div>
    <span class="feed-time">방금 전</span>
  `;
  return item;
}

if (feedContainer) {
  for (let i = 0; i < 3; i++) {
    feedContainer.appendChild(createFeedItem(mockActivities[activityIndex]));
    activityIndex = (activityIndex + 1) % mockActivities.length;
  }
  
  function rotateFeed() {
    const nextAct = mockActivities[activityIndex];
    activityIndex = (activityIndex + 1) % mockActivities.length;
    
    const newItem = createFeedItem(nextAct);
    feedContainer.appendChild(newItem);
    
    feedContainer.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    feedContainer.style.transform = 'translateY(-68px)';
    
    setTimeout(() => {
      if (feedContainer.firstElementChild) {
        feedContainer.removeChild(feedContainer.firstElementChild);
      }
      feedContainer.style.transition = 'none';
      feedContainer.style.transform = 'translateY(0)';
    }, 600);
  }
  
  setInterval(rotateFeed, 3500);
}

// 5. Scroll Reveal Effects
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => revealObserver.observe(el));
}

// 6. Header scrolled effects
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });
}
