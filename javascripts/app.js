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
	  comparator: function(book) {
		  return -book.get(this.$('#manage').data('sort'));
		}
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
			"click .delete-book": "deleteBook",
			"click .sort": "sortBooks",
			"click #selectall": "selectAllBooks",
			"click .select": "selectBookRow",	
			"click #manage tbody tr": "selectBookRow",
			"click #deleteall": "deleteAll"													
    },

    initialize: function(){
      _.bindAll(this, "render", "tabs", "addAll", "addBook", "createBook", "editBook", "deleteBook", "sortBooks");
			this.activeBookId = null;
			this.$("#create").show();
      Books.bind('add', this.addBook); 
      Books.bind('reset', this.addAll);
      Books.fetch();
    },

    selectAllBooks: function(el){
	    var target = $(el.target), rows = this.$('#manage tr:not(#select-info)');
			if(target.is(':checked'))
			{
				rows.css({background:"whiteSmoke"}).find('.select').prop("checked", true);
			}
			else
			{
				rows.css({background:"white"}).find('.select').prop("checked", false);
			}
			this.showSelected();
		},

		selectBookRow: function(el){
			var target = $(el.target), row = target.parents("tr"), checkbox = row.find('.select');
			if(checkbox.is(':checked'))
			{
				row.css({background:"white"});
				checkbox.prop("checked", false);
			}
			else
			{
				row.css({background:"whiteSmoke"});
				checkbox.prop("checked", true);
			}
			this.showSelected();			
		},		
		
		showSelected: function(){
			var info = $('#select-info'), count = $('#manage .select:checked').length, word = count>1?"books":"book",
			    html = '<tr id="select-info"><td colspan="6">('+count+') '+word+' selected. <a id="deleteall" href="javascript:void(0);">delete</a></td></tr>';
			if(Books.length>0)
			{
				if(info.length === 0)
				{
				  $('#manage tbody').prepend(html);	
				}
				else if(count>0)
				{
					info.replaceWith($(html));
				}
				else
				{
					info.remove();
				}
			}	
		},
		
		deleteAll: function(){	
			$('#manage tbody').find('input:checked').each(function() {
				var that = $(this);
				Books.get(that.data('id')).destroy();
				that.parents('tr').remove();
			});
			$('#select-info').hide();
			$('#selectall').prop("checked", false);
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
				this.$('#selectall').prop("checked", false);
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
			Books.get(this.activeBookId).set(data).save();
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
	
	  sortBooks: function(el){
		  var target = $(el.target);
		  $('#manage').data('sort', target.data('sort'));
		  Books.sort();
			this.addAll();
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