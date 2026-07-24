import './style.css'
import heroVideoUrl from './assets/hero_video.mp4'

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
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

function handleScroll() {
  // --- SECTION 0: HERO STEPPED SCROLL REVEAL ---
  const heroTrack = document.getElementById('hero-track');
  if (heroTrack) {
    const progress = getScrollProgress(heroTrack);
    const heroContent = document.getElementById('hero-content');
    const heroPreview = document.getElementById('hero-preview');
    const heroHint = document.getElementById('hero-scroll-hint');
    const heroOverlay = document.querySelector('.hero__video-overlay');

    // Stage 1: progress < 0.10 => Only video (bright overlay, text hidden, preview hidden)
    // Stage 2: 0.10 -> 0.40 => Text fades in (overlay dims for readability)
    // Stage 3: 0.55 -> 0.85 => Previews fade & slide in (clear gap after text)
    // Stage 4: 0.85 -> 1.00 => Pinned hold

    let textOpacity = 0;
    if (progress > 0.10) {
      textOpacity = Math.min((progress - 0.10) / 0.30, 1);
    }

    let previewOpacity = 0;
    if (progress > 0.55) {
      previewOpacity = Math.min((progress - 0.55) / 0.30, 1);
    }

    let overlayOpacity = 0.15 + (textOpacity * 0.40); // 0.15 bright video -> 0.55 readable backdrop

    if (heroContent) {
      heroContent.style.opacity = textOpacity.toString();
      heroContent.style.visibility = textOpacity > 0.02 ? 'visible' : 'hidden';
      heroContent.style.pointerEvents = textOpacity > 0.5 ? 'auto' : 'none';
      heroContent.style.transform = `translateY(${(1 - textOpacity) * 40}px)`;
    }

    if (heroPreview) {
      heroPreview.style.opacity = previewOpacity.toString();
      heroPreview.style.visibility = previewOpacity > 0.02 ? 'visible' : 'hidden';
      heroPreview.style.pointerEvents = previewOpacity > 0.5 ? 'auto' : 'none';
      heroPreview.style.transform = `rotateX(10deg) rotateY(-22deg) rotateZ(6deg) translateY(${(1 - previewOpacity) * 50}px)`;
    }

    let hintOpacity = progress < 0.15 ? Math.max(1 - (progress / 0.15), 0) : 0;

    if (heroHint) {
      heroHint.style.opacity = hintOpacity.toString();
      heroHint.style.visibility = hintOpacity > 0.05 ? 'visible' : 'hidden';
    }

    if (heroOverlay) {
      heroOverlay.style.background = `rgba(6, 7, 10, ${overlayOpacity})`;
    }
  }

  // --- SECTION 1: COURSE OCCUPANCY ---
  const occTrack = document.getElementById('track-occupancy');
  if (occTrack) {
    const progress = getScrollProgress(occTrack);
    
    // Update Cues active classes
    updateCues('occ-cue-', progress);
    
    const phoneOcc = document.getElementById('phone-occ');
    const cardOcc = document.getElementById('card-occ');
    const grid = occTrack.querySelector('.scroll-grid');
    
    // Centering and shifting animation (progress 0.00 -> 0.20)
    if (grid && phoneOcc) {
      const gridRect = grid.getBoundingClientRect();
      const phoneRect = phoneOcc.getBoundingClientRect();
      
      const gridCenter = gridRect.left + gridRect.width / 2;
      const phoneCenter = phoneRect.left + phoneRect.width / 2;
      const currentShiftX = parseFloat(phoneOcc.style.getPropertyValue('--shift-x') || 0);
      
      const centerOffset = gridCenter - (phoneCenter - currentShiftX);
      
      let shiftX = 0;
      if (progress < 0.20) {
        shiftX = centerOffset * (1 - (progress / 0.20));
      }
      phoneOcc.style.setProperty('--shift-x', shiftX.toString());
    }
    
    if (phoneOcc) {
      // Parallax scroll effect for the app screenshot background
      const panProgress = Math.min(progress / 0.45, 1);
      phoneOcc.style.setProperty('--screen-scroll-y', (panProgress * -15).toString());
    }
    
    // 3D Tilt Phone & Rise Card (occurs from 45% to 70% progress, holds 70% to 100%)
    if (progress >= 0.45) {
      const stage = Math.min((progress - 0.45) / 0.25, 1);
      
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
    const grid = crewTrack.querySelector('.scroll-grid');
    
    // Centering and shifting animation (progress 0.00 -> 0.20)
    if (grid && phoneCrew) {
      const gridRect = grid.getBoundingClientRect();
      const phoneRect = phoneCrew.getBoundingClientRect();
      
      const gridCenter = gridRect.left + gridRect.width / 2;
      const phoneCenter = phoneRect.left + phoneRect.width / 2;
      const currentShiftX = parseFloat(phoneCrew.style.getPropertyValue('--shift-x') || 0);
      
      const centerOffset = gridCenter - (phoneCenter - currentShiftX);
      
      let shiftX = 0;
      if (progress < 0.20) {
        shiftX = centerOffset * (1 - (progress / 0.20));
      }
      phoneCrew.style.setProperty('--shift-x', shiftX.toString());
    }
    
    if (phoneCrew) {
      const panProgress = Math.min(progress / 0.45, 1);
      phoneCrew.style.setProperty('--screen-scroll-y', (panProgress * -15).toString());
    }
    
    // 3D Tilt Phone & Rise Card (occurs from 45% to 70% progress, holds 70% to 100%)
    if (progress >= 0.45) {
      const stage = Math.min((progress - 0.45) / 0.25, 1);
      
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
}

// Update Side Cues active state based on ranges
function updateCues(prefix, progress) {
  const cue1 = document.getElementById(prefix + '1');
  const cue2 = document.getElementById(prefix + '2');
  const cue3 = document.getElementById(prefix + '3');
  
  if (!cue1 || !cue2 || !cue3) return;
  
  // Calculate opacities using a trapezoidal shape to keep cues fully visible (opacity 1.0) longer
  const op1 = getTrapezoidOpacity(progress, 0.08, 0.16, 0.38, 0.44);
  const op2 = getTrapezoidOpacity(progress, 0.44, 0.50, 0.68, 0.74);
  const op3 = getTrapezoidOpacity(progress, 0.74, 0.80, 0.94, 0.99);
  
  // Apply opacities, visibility, and translateY offset
  setCueStyle(cue1, op1);
  setCueStyle(cue2, op2);
  setCueStyle(cue3, op3);
}

function getTrapezoidOpacity(progress, start, fadeInEnd, fadeOutStart, end) {
  if (progress < start || progress > end) return 0;
  if (progress >= fadeInEnd && progress <= fadeOutStart) return 1;
  if (progress < fadeInEnd) {
    return (progress - start) / (fadeInEnd - start);
  } else {
    return (end - progress) / (end - fadeOutStart);
  }
}

function setCueStyle(cue, opacity) {
  cue.style.opacity = opacity.toString();
  cue.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
  cue.style.transform = `translateY(-50%) translateY(${(1 - opacity) * 20}px)`;
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

        if (crewsEl) animateValue(crewsEl, 0, 1482, 1800, v => v.toString());
        if (cheersEl) animateValue(cheersEl, 0, 12895, 1500, v => v.toString());
        
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
    let currentVal = parseInt(el.textContent);
    if (isNaN(currentVal)) return;
    currentVal += 1;
    el.textContent = currentVal.toString();
  }, 4000);
}

// 4. Live Activity Feed simulation
const mockActivities = [
  { type: 'book', name: '크루 [러너스하이]', text: '가 반포한강공원 B코스 저녁 8시 예약을 <strong>선점</strong>했습니다.' },
  { type: 'check', name: '김민지', text: '님이 여의도 정기런 모임 <strong>출석체크</strong>를 완료했습니다 (참석확정).' },
  { type: 'bill', name: '크루 [PaceMakers]', text: '의 뒷풀이 정산이 완료되었습니다 (1인당 <strong>₩6,500 자동정산</strong>).' },
  { type: 'check', name: '박선우', text: '님이 잠실 트랙 번개런에 도착하여 <strong>원터치 출석</strong>을 완료했습니다.' },
  { type: 'book', name: '크루 [남산러너스]', text: '가 남산 둘레길 코스 일요일 오전 예약을 <strong>등록</strong>했습니다.' },
  { type: 'bill', name: '크루 [RunClub]', text: '의 이번 달 회비 <strong>자동정산 분할청구</strong>가 발송되었습니다.' },
  { type: 'book', name: '크루 [뚝섬크루]', text: '가 뚝섬유원지 러닝 구간 예약을 변경하였습니다.' }
];

const feedContainer = document.getElementById('feed-container');
let activityIndex = 0;

const svgIcons = {
  book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
  bill: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>`
};

function createFeedItem(act) {
  const item = document.createElement('div');
  item.className = 'feed-item';
  
  const iconSvg = svgIcons[act.type] || svgIcons.book;
  
  item.innerHTML = `
    <div class="feed-icon feed-icon--${act.type}">${iconSvg}</div>
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

// 7. Hero Video Initialization & Smooth Playback
const setupHeroVideo = () => {
  const video = document.querySelector('.hero__bg-video');
  if (!video) return;

  video.src = heroVideoUrl;
  video.muted = true;
  video.playsInline = true;

  const markPlaying = () => {
    if (!video.paused && video.currentTime > 0.01) {
      video.classList.add('is-playing');
    }
  };

  video.addEventListener('timeupdate', markPlaying);
  video.addEventListener('playing', markPlaying);

  const tryPlay = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        markPlaying();
      }).catch(() => {
        const playOnGesture = () => {
          video.play().then(() => markPlaying()).catch(() => {});
        };
        window.addEventListener('scroll', playOnGesture, { passive: true, once: true });
        window.addEventListener('touchstart', playOnGesture, { passive: true, once: true });
        window.addEventListener('click', playOnGesture, { passive: true, once: true });
      });
    }
  };

  tryPlay();
};

// Initial scroll & video calculation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupHeroVideo();
    handleScroll();
  });
} else {
  setupHeroVideo();
  handleScroll();
}

window.addEventListener('load', () => {
  setupHeroVideo();
  handleScroll();
  const vid = document.querySelector('.hero__bg-video');
  console.log('HERO_STATS:', {
    vid_display: vid ? window.getComputedStyle(vid).display : 'none',
    vid_opacity: vid ? window.getComputedStyle(vid).opacity : '0',
    vid_readyState: vid ? vid.readyState : 0,
    vid_paused: vid ? vid.paused : true,
    vid_currentTime: vid ? vid.currentTime : 0,
    vid_videoWidth: vid ? vid.videoWidth : 0
  });
});

// =============================================
// Feature Showcase Section (FSS) — Image Carousel
// =============================================
(function initFSSCarousel() {
  const imgs = document.querySelectorAll('.fss-phone-img');
  const dots = document.querySelectorAll('.fss-dot');
  const playBtn = document.getElementById('fss-play-btn');
  if (!imgs.length || !dots.length) return;

  let current = 0;
  let playing = true;
  let autoTimer = null;
  const INTERVAL = 3500;

  function goTo(idx) {
    imgs[current].classList.remove('fss-img--active');
    dots[current].classList.remove('fss-dot--active');
    current = (idx + imgs.length) % imgs.length;
    imgs[current].classList.add('fss-img--active');
    dots[current].classList.add('fss-dot--active');
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
    playing = true;
    updatePlayBtn();
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
    playing = false;
    updatePlayBtn();
  }

  function updatePlayBtn() {
    if (!playBtn) return;
    const pauseIcon = playBtn.querySelector('.fss-icon-pause');
    const playIcon  = playBtn.querySelector('.fss-icon-play');
    const label     = playBtn.querySelector('.fss-play-label');
    if (playing) {
      pauseIcon && (pauseIcon.style.display = '');
      playIcon  && (playIcon.style.display  = 'none');
      label     && (label.textContent        = '정지');
      playBtn.setAttribute('aria-label', '정지');
    } else {
      pauseIcon && (pauseIcon.style.display = 'none');
      playIcon  && (playIcon.style.display  = '');
      label     && (label.textContent        = '재생');
      playBtn.setAttribute('aria-label', '재생');
    }
  }

  // Play/Pause button
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (playing) stopAuto();
      else startAuto();
    });
  }

  // Dot click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAuto(); // restart timer on manual nav
    });
  });

  // Swipe (mobile)
  const phoneFrame = document.querySelector('.fss-phone-frame');
  if (phoneFrame) {
    let sx = 0;
    phoneFrame.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    phoneFrame.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) {
        goTo(current + (dx < 0 ? 1 : -1));
        startAuto();
      }
    }, { passive: true });
  }

  startAuto();
})();

