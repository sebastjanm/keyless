import gulp from 'gulp';
import postcss from 'gulp-postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Define the CSS task
function css() {
  console.log('Starting CSS task...');
  return gulp.src('src/styles/styles.css')
    .pipe(postcss([
      tailwindcss(),
      autoprefixer(),
    ]))
    .on('error', (err) => {
      console.error('Error in postcss pipeline:', err);
    })
    .pipe(gulp.dest('public/css'))
    .on('end', () => {
      console.log('CSS task completed.');
    });
}

// Define the watch task
function watch() {
  console.log('Starting watch task...');
  gulp.watch('src/styles/**/*.css', css)
    .on('change', (path, stats) => {
      console.log(`File ${path} was changed`);
    })
    .on('error', (err) => {
      console.error('Error in watch task:', err);
    });
}

// Define the default task
const defaultTask = gulp.series(css, watch);

export { css, watch, defaultTask as default };
