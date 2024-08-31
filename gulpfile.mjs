import gulp from 'gulp';
import postcss from 'gulp-postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import { v4 as uuidv4 } from 'uuid';

const bs = browserSync.create();

// Define the CSS task
function css() {
  const uuid = uuidv4();
  console.log('Starting CSS task...');
  return gulp.src('src/styles/styles.css')
    .pipe(postcss([
      tailwindcss(),
      autoprefixer(),
    ]))
    .on('error', (err) => {
      console.error('Error in postcss pipeline:', err);
      this.emit('end');  // Continue running on errors
    })
    .pipe(gulp.dest('public/css'))
    .pipe(bs.stream())  // Inject CSS changes without a full page reload
    .on('end', () => {
      console.log('CSS task completed.');
    });
}

// Define the watch task
function watch() {
  console.log('Starting watch task...');
  bs.init({
    proxy: 'http://localhost:3000',  // Proxy requests to backend on port 3000
    port: 3001,  // BrowserSync serves the frontend on port 3001
    open: false,
    notify: false,
  });

  // Watch CSS files and run the css task on changes
  gulp.watch('src/styles/*.css', css);

  // Watch HTML and config files and trigger a full page reload on changes
  gulp.watch(['public/html/*.html', 'tailwind.config.js']).on('change', bs.reload);
}

// Define the default task
const defaultTask = gulp.series(css, watch);

export { css, watch, defaultTask as default };
