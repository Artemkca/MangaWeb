import { useEffect, useRef } from 'react';

export function useDragScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let moved = false;

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      isDown = true;
      moved = false;
      startX = e.pageX;
      scrollLeft = element.scrollLeft;
      element.classList.add('is-dragging');
    };

    const onMouseLeave = () => {
      isDown = false;
      element.classList.remove('is-dragging');
    };

    const onMouseUp = () => {
      isDown = false;
      element.classList.remove('is-dragging');
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const walk = e.pageX - startX;
      if (Math.abs(walk) > 3) moved = true;
      element.scrollLeft = scrollLeft - walk;
    };

    const onClick = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        element.scrollLeft += e.deltaY;
      }
    };

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('mouseup', onMouseUp);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('click', onClick, true);
    element.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mouseleave', onMouseLeave);
      element.removeEventListener('mouseup', onMouseUp);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('click', onClick, true);
      element.removeEventListener('wheel', onWheel);
    };
  }, []);

  return ref;
}

export function useContinueFade() {
  const trackRef = useDragScroll();
  const sliderRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const slider = sliderRef.current;
    if (!track || !slider) return undefined;

    const update = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const canScroll = maxScroll > 5;
      slider.classList.toggle('continue-slider--can-scroll', canScroll && track.scrollLeft < maxScroll - 5);
    };

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [trackRef]);

  return { trackRef, sliderRef };
}
