module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist : {
                src : [
                    'js/customerPortal/index.route.js', 
                    'js/customerPortal/custPortalHome.controller.js',
                    'js/customerPortal/booking.controller.js',
                    'js/customerPortal/bookingConfirmation.controller.js',
                    'js/customerPortal/otherPages.controller.js', 
                    'js/customerPortal/promo-script.js',
                    'js/services/custApiService.js',
                    'js/services/custportalService.js',                    
                    'js/utils/common.js',
                    'js/utils/utility.js',
                    // 'js/angular-cookies.js',
                    'js/moment.js',
                    'js/moment-with-locales.js',
                    'js/ui-bootstrap-tpls-0.13.4.js',
                    'js/bootstrap-datetimepicker1.js'
                ],
                dest: 'production/scripts.js'
            }
        },
        uglify: {
            build: {
                src: 'production/scripts.js',
                dest: 'production/scripts.min.js'
            }
        },
        cssmin : {
            combine : {
                files : {
                    'css/customerPortal/styles.css' : ['css/customerPortal/custPortalHome.css', 
                        'css/customerPortal/custPortalHome_mediaquery.css', 
                        'css/customerPortal/custPortalBooking.css', 
                        'css/customerPortal/custPortalBooking_mediaquery.css', 
                        'css/customerPortal/innerpages.css', 
                        'css/customerPortal/innerpage_mediaquery.css', 
                        'css/menu_pure_drawer/pure-drawer.css', 
                        'css/bootstrap-datetimepicker.css', 
                        'css/acute.select.css']
                }
            }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};
