const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /dashboard -- redirected on successful login/signup events in public/js/login.js and requested from dashboard button in nav
router.get('/', withAuth, (req, res) => {
	Post.findAll({
		where      : {
			// use the ID from the session
			user_id : req.session.user_id
		},
		attributes : [
			'id',
			'title',
			'content',
			'created_at'
		],
		order      : [ [ 'created_at', 'DESC' ] ],
		include    : [
			{
				model      : Comment,
				attributes : [ 'id', 'comment_text', 'post_id', 'user_id', 'created_at' ],
				include    : {
					model      : User,
					attributes : [ 'username' ]
				}
			},
			{
				model      : User,
				attributes : [ 'username' ]
			}
		]
	})
		.then((dbPostData) => {
			// serialize data before passing to template
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      // render template and pass through db data
			res.render('dashboard', {
        layout: 'dashboard',
				posts,
				loggedIn : true
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// GET /dashboard/edit/1 -- render post form view by id 
router.get('/edit/:id', withAuth, (req, res) => {
	Post.findOne({
		where      : {
			id : req.params.id
		},
		attributes : [
			'id',
			'title',
			'content',
			'created_at'
		],
		include    : [
			{
				model      : Comment,
				attributes : [ 'id', 'comment_text', 'post_id', 'user_id', 'created_at' ],
				include    : {
					model      : User,
					attributes : [ 'username' ]
				}
			},
			{
				model      : User,
				attributes : [ 'username' ]
			}
		]
	})
		.then((dbPostData) => {
			if (!dbPostData) {
				res.status(404).json({ message: 'No post found with this id' });
				return;
			}

			// serialize the data
			const post = dbPostData.get({ plain: true });

			// pass data to template
			res.render('edit-post', {
				post,
				loggedIn : true
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.get('/new', (req, res) => {
  res.render('add-post', {
    layout: 'dashboard'
  });
})



module.exports = router;



// here you can specify another 'parent' file
// res.render('dashboard', {
//   layout: 'dashboard', 
//   posts
// })

// Layouts
// A layout is simply a Handlebars template with a {{{body}}} placeholder. Usually it will be an HTML page wrapper into which views will be rendered.

// This view engine adds back the concept of "layout", which was removed in Express 3.x. It can be configured with a path to the layouts directory, by default it's set to relative to express settings.view + layouts/

// There are two ways to set a default layout: configuring the view engine's defaultLayout property, or setting Express locals app.locals.layout.

// The layout into which a view should be rendered can be overridden per-request by assigning a different value to the layout request local. The following will render the "home" view with no layout:

// app.get('/', function (req, res, next) {
//     res.render('home', {layout: false});
// });



// layoutsDir
// Default layouts directory is relative to express settings.view + layouts/ The string path to the directory where the layout templates reside.

// Note: If you configure Express to look for views in a custom location (e.g., app.set('views', 'some/path/')), and if your layoutsDir is not relative to express settings.view + layouts/, you will need to reflect that by passing an updated path as the layoutsDir property in your configuration.

// defaultLayout
// The string name or path of a template in the layoutsDir to use as the default layout. main is used as the default. This is overridden by a layout specified in the app or response locals. Note: A falsy value will render without a layout; e.g., res.render('home', {layout: false});.


// // Middleware to expose the app's shared templates to the client-side of the app
// // for pages which need them.
// function exposeTemplates (req, res, next) {
// 	// Uses the `ExpressHandlebars` instance to get the get the **precompiled**
// 	// templates which will be shared with the client-side of the app.
// 	hbs.getTemplates("shared/templates/", {
// 		cache: app.enabled("view cache"),
// 		precompiled: true,
// 	}).then(function (templates) {
// 		// RegExp to remove the ".handlebars" extension from the template names.
// 		const extRegex = new RegExp(hbs.extname + "$");

// 		// Creates an array of templates which are exposed via
// 		// `res.locals.templates`.
// 		templates = Object.keys(templates).map(function (name) {
// 			return {
// 				name: name.replace(extRegex, ""),
// 				template: templates[name],
// 			};
// 		});

// 		// Exposes the templates during view rendering.
// 		if (templates.length) {
// 			res.locals.templates = templates;
// 		}

// 		setImmediate(next);
// 	})
// 		.catch(next);
// }