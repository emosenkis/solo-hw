function main () {
    return union(
        difference(Case(), cube([box.l, box.w, box.h]).translate([0,-box.w/2, 0])).translate([0,0,box.h/2]),
        difference(Case(), cube([box.l, box.w, box.h]).translate([0,-box.w/2, -box.h])).rotateX(180).translate([0, box.w + 5, box.h/2])
        );
}

function Case() {


    return difference(block(), cutouts()).translate([1,1-box.w/2,box.thickness-box.h/2]);
}

function block() {
    return raw_pcb().expand(1, 8).extrude({offset:[0,0,box.h]}).translate([0,0,-box.thickness]);
}

function cutouts() {
    return union(
      difference(
          cavity(),
          difference(
              cylinder({r: keychain.r+1, h: cavity.h}),
              // Cutout for components near keychain hole
              cube([keychain.r*2+2, 1, cavity.h/2]).translate([-keychain.r-1, keychain.r, cavity.h/2])
          ).translate(keychain.offset),
          cube([led_channel.l, led_channel.w, led_channel.h]).translate(led_channel.offset)
      ),
      pcb().extrude({offset:[0,0,pcb.h]}).translate([0,0,(cavity.h-wing.h)/2]),
      cube([usb.l, usb.w, usb.h]).translate([-1,(cavity.w-usb.w)/2,(cavity.h-usb.h)/2]),
      cylinder({r: keychain.r, h: box.h}).translate(keychain.offset).translate([0,0,-box.thickness]),
      cube([led.l, led.w, led.h]).translate(led.offset)
    );
}

function cavity() {
    return raw_pcb().extrude({offset:[0,0,cavity.h]});
}

function raw_pcb() {
    return union(
        square([pcb.l-4, pcb.w]),
        square([4, cavity.w-8]).translate([cavity.l-4, 4]),
        circle(4).translate([cavity.l-8, 0]),
        circle(4).translate([cavity.l-8, cavity.w-8]));
}

function pcb() {
    return union(raw_pcb(), wing());
}

function wing() {
    return square([wing.l, wing.w]).translate(wing.offset)
}

pcb.l = 32; pcb.w = 17; pcb.h = 0.85;
cavity.l = pcb.l; cavity.w = pcb.w; cavity.h = 3.4;
box = {l: cavity.l + 2, w: cavity.w + 2, thickness: 0.6};
box.h = cavity.h + 2 * box.thickness;
wing.l = 14, wing.w = box.w; wing.h = pcb.h; wing.offset = [8.6, -1];
usb = {l: 4.4, w: 9, h: 4};
keychain = {r: 4.25/2, offset: [26.75, pcb.w/2]};
led = {l: 2, w: 2, h: box.h/2, thickness: 0.2};
led.offset = [19.3-led.l/2, pcb.w/2-led.w/2, box.h/2-box.thickness-led.thickness];
led_channel = {thickness: 0.6};
led_channel = {l: led.l + 2 * led_channel.thickness, w: led.w + 2 * led_channel.thickness, h: cavity.h/2,
    offset: [led.offset[0] - led_channel.thickness, led.offset[1] - led_channel.thickness, cavity.h/2]};