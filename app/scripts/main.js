addClass = function(el, c) {
  var i = el.className.indexOf(c);
  if(i > -1) return el;
  else return (el.className = (el.className + ' ' + c.trim()).trimLeft(), el); 
}

removeClass = function(el, c) {
  var i = el.className.indexOf(c);
  if(i < 0) return el;
  else return (el.className = el.className.replace(c.trim(), '')
                                          .replace('  ', ' '), 
               el);
}

function extend(el) {
  el.addClass = function(c) {
    addClass(el, c);
  }
  el.removeClass = function(c) {
    removeClass(el, c);
  }
  
  return el;
}

function extendAll(els) {
  [].forEach.call(els, extend);
}

var qq = function(sel) { return document.querySelectorAll(sel); };

//----------------------------------------------------------------------------//

var cal   = document.getElementsByClassName('cal')[0];
var dates = qq('.cal .date');

dates.findDate = function(dateString) {
  var month
    , day;
  
  month = (month = dateString.split('.'), day = month[1], month[0]);
  
  return qq('.cal .date.day_' + day + '.month_' + month)[0];
}

function calendar_resize(breakpoint) {
  var cal_width
    , win_width;

  win_width = window.innerWidth;
  cal_width = win_width > breakpoint ? Math.min(win_width * 0.8/7, 160) : win_width * 0.9/4;
  cal.style.width  = (win_width > breakpoint ? cal_width * 7 - 12 : cal_width * 4 - 6) + "px";
  cal.style.height = (win_width > breakpoint ? (cal_width - 4) * 5 + 12 : (cal_width - 4) * 9 + 14) + "px";
  [].forEach.call(dates, function(date) {
    date.style.width = cal_width - 4 + "px";
    date.style.height = date.style.width;
  });
}

function event_backface_stringify(ev) {
  var time
    , location
    , addtl;
  
  time      = ev.times && ev.times.map(function(t) {
                return (t % 1200)/100 + (t > 1200 ? "PM" : "AM");
              }).join(' & ');
  location  = ev.location;
  addtl     = ev.info;
  
  return [time, location, addtl].join(" ");
}

function load_date_data(dateString, data) {
  var date
    , data_span
    , info;
  
  date = dates.findDate(dateString);
  
  var data_span = date.querySelectorAll('span')[0];

  date.addClass('event');

  // add the event name to the node's data
  (date.events = (date.events || [])).push(data.name);

  // process the data into a string
  info = event_backface_stringify(data);

  // and add the info to the date node
  data_span.innerHTML = data_span.innerHTML.length < 3
    ? info
    : data_span.innerHTML + "<br><br>" + info;
}

function create_cover_flaps() {
  var tmp_flap;
  
  [].filter.call(dates, function(d) { return d.className.indexOf('event') > -1 })
       .forEach(function(d) {
         tmp_flap = document.createElement('div');
         tmp_flap.className = "cover-flap";
         tmp_flap.innerHTML = "<div class='v-center'><span>" + d.events.join('<br><br>') + "</span></div>";
         d.appendChild(tmp_flap);
       });
}

function calendar_load(events) {
  events.forEach(function(ev) {
    ev.dates.length > 1
      ? ev.dates.forEach(function(date) { load_date_data(date, ev) })
      : load_date_data(ev.dates[0], ev);
  });
  create_cover_flaps();
}

var events = [
  // military time bc easier to do am/pm that way -- JTT (9/16/14)
  { name: "Ferris Bueller's Day Off", dates: ['0.16'], times: [2000], location: "Norris East Lawn" },
  { name: "Neighbors", dates: ['0.26', '0.27'], times: [1900, 2200], location: "McCormick Auditorium" },
  { name: "A&O @ the Activities Fair", dates: ['0.27'], times: [1100], location: "Norris" },
  { name: "Info Session I", dates: ['1.5'], info: "Time & Location TBA" },
  { name: "BLOWOUT", dates: ['1.10'], times: [1900], location: "Welsh-Ryan Auditorium", special_classes: ['blowout'] },
  //{ name: "Info Session II", dates: ['1.12'], info: "Time and Location TBA" }, 
  { name: "Guardians of the Galaxy", dates: ['1.17', '1.18'], times: [1900, 2200], location: "McCormick Auditorium" }
]

window.onload = function() {
  extendAll(dates);
  calendar_resize(800);
  // calendar_load requires that the dates object be extended -- JTT 9/16/14
  calendar_load(events);
}

window.onresize = function() {
  calendar_resize(850);
}
