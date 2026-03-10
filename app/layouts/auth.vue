<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12"
  >
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-5xl font-bold text-blue-700 mb-2">
            ⚽ Success Secrets Bet
          </h1>
        </NuxtLink>
        <p class="text-gray-600 text-lg">
          Expert predictions for your winning edge
        </p>
      </div>

      <!-- Auth Form Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <slot/>
      </div>

      <!-- Back to Home Link -->
      <div class="text-center mt-6">
        <NuxtLink
          to="/"
          class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
