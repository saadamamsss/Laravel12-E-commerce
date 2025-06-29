<template>
  <div class="min-h-screen bg-gradient-to-br from-[#ff2832]/10 to-text-[#ff2832] flex items-center justify-center p-6">
    <div class="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden">
      <div class="p-8 text-center">
        <!-- SVG illustration -->
        <div class="mx-auto w-64 h-64 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-[#ff2832]/20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 class="text-4xl font-bold text-gray-800 mb-3">Lost in Space</h1>
        <p class="text-gray-600 mb-8">
          You've reached the edge of the universe. The page you requested was not found.
        </p>
        
        <Link 
          href="/" 
          class="inline-flex items-center px-6 py-3 bg-[#ff2832] hover:bg-[#ff2832]/90 text-white rounded-full transition shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Link } from '@inertiajs/vue3';
</script>