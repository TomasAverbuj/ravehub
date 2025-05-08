<script>
import { ref, onMounted } from 'vue';
import { useMotion, useSpring } from '@vueuse/motion';

export default {
  name: 'EventCard',
  props: {
    imageSrc: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    containerHeight: {
      type: String,
      default: '300px'
    },
    containerWidth: {
      type: String,
      default: '100%'
    },
    imageHeight: {
      type: String,
      default: '300px'
    },
    imageWidth: {
      type: String,
      default: '300px'
    },
    scaleOnHover: {
      type: Number,
      default: 1.1
    },
    rotateAmplitude: {
      type: Number,
      default: 14
    }
  },
  setup(props) {
    const cardRef = ref(null);
    const lastY = ref(0);
    
    const { apply: applyMotion } = useMotion(cardRef, {
      initial: {
        rotateX: 0,
        rotateY: 0,
        scale: 1
      }
    });

    const springConfig = {
      damping: 30,
      stiffness: 100,
      mass: 2
    };

    const handleMouse = (e) => {
      if (!cardRef.value) return;

      const rect = cardRef.value.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      const rotationX = (offsetY / (rect.height / 2)) * -props.rotateAmplitude;
      const rotationY = (offsetX / (rect.width / 2)) * props.rotateAmplitude;

      applyMotion({
        rotateX: rotationX,
        rotateY: rotationY,
        transition: springConfig
      });
    };

    const handleMouseEnter = () => {
      applyMotion({
        scale: props.scaleOnHover,
        transition: springConfig
      });
    };

    const handleMouseLeave = () => {
      applyMotion({
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        transition: springConfig
      });
    };

    return {
      cardRef,
      handleMouse,
      handleMouseEnter,
      handleMouseLeave
    };
  }
}
</script>

<template>
  <figure
    ref="cardRef"
    class="relative w-full h-full perspective-800 flex flex-col items-center justify-center cursor-pointer"
    :style="{
      height: containerHeight,
      width: containerWidth
    }"
    @mousemove="handleMouse"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="$emit('click')"
  >
    <div class="relative transform-style-preserve-3d" :style="{ width: imageWidth, height: imageHeight }">
      <img
        :src="imageSrc"
        :alt="title"
        class="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform transform-z-0"
        :style="{
          width: imageWidth,
          height: imageHeight
        }"
      />
      <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-[15px]">
        <h3 class="text-lg font-semibold font-manrope">{{ title }}</h3>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.perspective-800 {
  perspective: 800px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.transform-z-0 {
  transform: translateZ(0);
}

.will-change-transform {
  will-change: transform;
}

.font-manrope {
  font-family: 'Manrope', sans-serif;
}
</style> 