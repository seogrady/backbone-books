$(function(){

  window.Book = Backbone.Model.extend({
    defaults: {
      title: null,
      author: null,
      date: new Date(),
      isbn: null
    }
  });

  window.BooksCollection = Backbone.Collection.extend({
    model: Book,
    localStorage: new Store("_books"),
  });

  window.Books = new BooksCollection;

  window.BookView = Backbone.View.extend({
    tagName: "li",

    events: {
      "click li .checkbox": "toggleDone"
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
			"click #add-book": "createBook"
    },

    initialize: function(){
      _.bindAll(this, "render");
    },

		tabs: function(e){
		  var target = $(e.target);
		  $('.tabs a').removeClass('active');
		  target.addClass('active');
		  if(target.attr('id') === "create")
		  {
		    this.$("#contents").html(jQuery.tmpl($("#create-view").template(), {}));	
		  }
		  else
		  {	
			
		  }
		},

	  // addAll: function(){
	  // 			Books.each(this.addBook)
	  // },
	  // 
	  // addBook: function(book){
	  //   var view = new BookView({model: book});
	  //   this.$(".contents").html("jahsbdjahbsdjasdhb");
	  // },

	  createBook: function(e){
			var data = {};
			$('#book-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
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