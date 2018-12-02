var gulp = require("gulp");

var url = require("url");
var fs = require("fs");
var path = require("path");

var autoprefixer = require("gulp-autoprefixer");
var sass = require("gulp-sass");
var minCss = require("gulp-clean-css");
var concat = require("gulp-concat");
var minJs = require("gulp-uglify");
var server = require("gulp-webserver");
var babel = require('gulp-babel');
var list = require('./mock/list.json');

// gulp.task("default", function() {
//     return gulp.src('./src/**/*.html').pipe(gulp.dest('./build'))
// })
gulp.task("devScss", function() {
        return gulp.src('./src/scss/*.scss')
            .pipe(sass())
            .pipe(minCss())
            .pipe(concat('all.css'))
            .pipe(autoprefixer({
                browsers: ['last 2 versions']
            }))
            .pipe(gulp.dest('./src/css'))
    })
    //监听
gulp.task('watch', () => {
    return gulp.watch('./src/scss/*.scss', gulp.series('devScss'));

})
gulp.task('dev', gulp.series('devScss', 'watch'));

gulp.task('server', () => {
    return gulp.src('src')
        .pipe(server({
            port: 9090, //配置端口
            open: true, //自动打开浏览器
            // livereload: true, //自动刷新浏览器
            host: '169.254.47.175', //配置ip
            // fallback: 'page/ddd.html', //指定默认打开的文件
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico' || req.url === 'swiper.min.js.map') {
                    res.end();
                    return
                }
                var pathname = url.parse(req.url).pathname;
                if (pathname == '/api/list') {
                    res.end(JSON.stringify({
                        code: 1,
                        data: list
                    }))
                } else {
                    console.log(pathname);
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                    // next();
                }

            }
        }))
})



//开发环境
gulp.task('devser', gulp.series('devScss', 'server', 'watch'))

//压缩js  build
gulp.task('minJs', () => {
    return gulp.src(['./src/js/**/*.js', '!./src/js/libs/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(minJs()).pipe(gulp.dest('./build'))
})

//copy js
gulp.task('copyLibs', function() {
    return gulp.src('./src/js/libs/*.js')
        .pipe(gulp.dest('./build/js/libs'))
})

//线上 css
gulp.task('bCss', function() {
    return gulp.src('./src/css/*.css')
        .pipe(gulp.dest('./build/css'))
})

//html

gulp.task('bHtml', function() {
    return gulp.src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build'))
})

//线上环境

gulp.task('build', gulp.parallel('minJs', 'copyLibs', 'bCss', 'bHtml'))