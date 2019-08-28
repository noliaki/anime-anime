import { Configuration } from '@nuxt/types'
import TerserPlugin from 'terser-webpack-plugin'

const config: Configuration = {
  mode: 'universal',
  serverMiddleware: [
    {
      path: '/api',
      handler: '~/serverMiddleware/api.ts'
    }
  ],
  dev: process.env.NODE_ENV !== 'production',
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'anime-anime',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Media' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['tailwindcss/dist/tailwind.min.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: '~/plugins/inject.ts'
    }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [],
  buildModules: ['@nuxt/typescript-build'],
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true
  },

  srcDir: 'src/',

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config: any, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (ctx.isClient) {
        if (!config.optimization.minimizer) {
          config.optimization.minimizer = []
        }

        config.optimization.minimizer.push(
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: process.env.NODE_ENV === 'production'
              }
            }
          })
        )
      }
    }
  }
}

export default config
