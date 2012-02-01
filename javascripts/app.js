$(function(){

  window.Book = Backbone.Model.extend({
    defaults: {
      title: null,
      author: null,
      date: null,
      isbn: null
    }
  });

  window.BooksCollection = Backbone.Collection.extend({
    model: Book,
    localStorage: new Store("_books"),
  });

  window.Books = new BooksCollection;

  window.BookView = Backbone.View.extend({
    tagName: "tr",

    events: {
    },

    template: $("#book-item").template(),

    initialize: function(){
      _.bindAll(this, "render");
    },

    render: function(){
      var element = jQuery.tmpl(this.template, this.model.toJSON());
      $(this.el).html(element);
      return this;
    }
  });

  window.AppView = Backbone.View.extend({
    el: $("#app"),
    events: {
      "click .tabs a": "tabs",
			"click #add-book": "createBook",
			"click .edit-book": "editBook",
			"click #update-book": "updateBook",			
			"click .delete-book": "deleteBook"							
    },

    initialize: function(){
      _.bindAll(this, "render", "tabs", "addAll", "addBook", "createBook", "editBook", "deleteBook");
			this.activeBookId = null;
			this.$("#create").show();
      Books.bind('add', this.addBook); 
      Books.bind('reset', this.addAll);
      Books.fetch();
    },

		tabs: function(e){
		  var target = $(e.target);
		  $('.tabs a').removeClass('active');
		  target.addClass('active');
		  this.$('.content').hide();
		  if(target.attr('id') === "create-tab")
		  {
		    this.$("#create").show();	
		  }
		  else
		  {	
			  this.addAll();
		    this.$("#manage").show();		
		  }
		},
		
		editBook: function(el){
			var target = $(el.target), book = Books.get(target.data('id'));
			this.activeBookId = target.data('id');
			$('#book-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				self.val(book.attributes[self.attr('name')]);
			});
			this.$('.content').hide();
			this.$('#manage-edit').show();
		},
		
		updateBook: function(el){
			var target = $(el.target), data = {};
			$('#book-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
			});
			Books.get(this.activeBookId).set(data);
			this.addAll();
			this.$('.content').hide();
			this.$('#manage').show();
		},

		deleteBook: function(el){
			var target = $(el.target);
			Books.get(target.data('id')).destroy();
			target.parents('tr').remove();
		},		

	  addAll: function(){
		  this.$("#manage table tbody").empty();
	    Books.each(this.addBook)
	  },
	  
	  addBook: function(book){
	    var view = new BookView({model: book});
	    this.$("#manage table tbody").prepend(view.render().el);
	  },

	  createBook: function(e){
			var data = {};
			$('#book-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
				self.val("");
			});
			Books.create(data);
	  }
  });

  window.App = new AppView();

  // window.AppController = Backbone.Router.extend({
  // 	
  // 	  initialize: function(){
  // 		$('.tabs a').removeClass('active');
  // 		this.mainView = new window.AppView
  // 	  },
  // 
  // 	  routes: {
  // 	    "create":"create",
  // 	    "books":"books"
  // 	  },
  // 
  // 	  create: function() {
  // 	    $('.tabs a#create').addClass('active');
  // 	  },
  // 
  // 	  books: function() {
  // 		$('.tabs a#books').addClass('active');
  // 	  }
  // 
  // });

  // window.App = new AppController();
  // Backbone.history.start();

});