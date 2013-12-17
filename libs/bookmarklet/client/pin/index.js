
module.exports = Pin;

function Pin() {
  this.url = window.location.href;
  this.description = description();
  this.domain = domain();
};

function description() {
  var description;
  var title = document.title;
  var metaTags = [].slice.call(document.querySelectorAll('meta'));
  if (metaTags.length) {
    description = metaTags.sort(function (a, b) {
      if(a.name > b.name) return -1;
      if(a.name < b.name) return 1;
      return 0;
    }).filter(function (item, index, arr) {
      return item.name.match(/description|og:description/);
      // Return a new array which the values of the return 
    }).map(function (item, index, arr) {
      return item.content;
    })[0];
  }
  return description || title;
};

function domain() {
  var a = document.createElement('a');
  a.href = window.location.href;
  return a.hostname;
}
