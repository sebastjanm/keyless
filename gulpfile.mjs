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
    .pipe(bs.stream({match: '**/*.css'}))
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

  gulp.watch(['src/styles/*.css', 'public/html/*.html', 'tailwind.config.js'], gulp.series(css))
    .on('change', (path, stats) => {
      console.log(`File ${path} was changed`);
      bs.reload();
    })
    .on('error', (err) => {
      console.error('Error in watch task:', err);
    });
}

// Define the default task without serving backend
const defaultTask = gulp.series(css, watch);

export { css, watch, defaultTask as default };
