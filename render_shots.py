# -*- coding: utf-8 -*-
import os
from PIL import Image, ImageDraw, ImageFont

OUT = "/sessions/wonderful-clever-lovelace/mnt/outputs/screenshots"
os.makedirs(OUT, exist_ok=True)
S = 2  # scale
W, Wt, H = 390, None, 844

def hx(h):
    h = h.lstrip("#"); return (int(h[0:2],16), int(h[2:4],16), int(h[4:6],16))
def rgba(h, a=255):
    r,g,b = hx(h); return (r,g,b,a)

C = dict(
    paper=hx("#F1EBE0"), surface=hx("#FCFAF5"), ink=hx("#221D1A"),
    inkSoft=hx("#5F564C"), inkMute=hx("#867D6F"), line=hx("#E8E0D2"),
    accent=hx("#4E4B8C"), accentTint=hx("#E7E5F1"), payBlack=hx("#16131A"),
    green=hx("#2F8B5B"), white=hx("#FFFFFF"), seal=hx("#6E6BB5"),
)

DS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DSB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
DSF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
DSFB = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
# verify serif Georgian coverage; fall back to sans-bold if missing
from fontTools.ttLib import TTFont as _TT
serif_ok = 0x10D0 in _TT(DSF).getBestCmap()
_fc = {}
def F(kind, sz):
    sz = int(sz*S)
    path = {"r":DS, "b":DSB, "sf":(DSFB if serif_ok else DSB), "sfr":(DSF if serif_ok else DS)}[kind]
    k=(path,sz)
    if k not in _fc: _fc[k]=ImageFont.truetype(path,sz)
    return _fc[k]

def make_seal(px, color):
    base = Image.new("RGBA",(240,240),(0,0,0,0)); bd=ImageDraw.Draw(base)
    for (x,y,w,h) in [(20,20,92,22),(20,20,22,74),(54,54,58,22),(54,54,22,40)]:
        bd.rectangle([x,y,x+w,y+h], fill=color+(255,))
    seal=Image.new("RGBA",(240,240),(0,0,0,0))
    for r in (0,90,180,270):
        seal=Image.alpha_composite(seal, base.rotate(r, resample=Image.BICUBIC, center=(120,120)))
    return seal.resize((int(px*S),int(px*S)), Image.LANCZOS)

def new_screen(bg):
    img = Image.new("RGB",(int(W*S),int(H*S)), bg); return img, ImageDraw.Draw(img)
def rr(d,x,y,w,h,r,fill=None,outline=None,width=1):
    d.rounded_rectangle([x*S,y*S,(x+w)*S,(y+h)*S], radius=r*S, fill=fill, outline=outline, width=int(width*S))
def rect(d,x,y,w,h,fill):
    d.rectangle([x*S,y*S,(x+w)*S,(y+h)*S], fill=fill)
def line(d,x,y,w,col=None):
    col=col or C["line"]; d.rectangle([x*S,y*S,(x+w)*S,y*S+1], fill=col)
def T(d,x,y,s,kind,sz,fill,anchor="la"):
    d.text((x*S,y*S), s, font=F(kind,sz), fill=fill, anchor=anchor)
def paste(img,im,x,y):
    img.paste(im,(int(x*S),int(y*S)),im)

def statusbar(d, dark=False):
    col = C["white"] if dark else C["ink"]
    T(d, 22, 16, "9:41", "b", 13, col, "lm")
    # battery
    bx,by=W-40,11
    d.rounded_rectangle([bx*S,by*S,(bx+22)*S,(by+11)*S], radius=2*S, outline=col, width=int(1*S))
    d.rectangle([(bx+22)*S,(by+3.5)*S,(bx+23.5)*S,(by+7.5)*S], fill=col)
    d.rounded_rectangle([(bx+1.5)*S,(by+1.5)*S,(bx+17)*S,(by+9.5)*S], radius=1*S, fill=col)
    # wifi/cell dots
    for i,h2 in enumerate([4,6,8,10]):
        d.rectangle([(W-78+i*5)*S,(by+ (10-h2))*S,(W-78+i*5+3)*S,(by+10)*S], fill=col)

def icon_plus(d,cx,cy,r,col,w=2.2):
    d.line([(cx-r)*S,cy*S,(cx+r)*S,cy*S],fill=col,width=int(w*S))
    d.line([cx*S,(cy-r)*S,cx*S,(cy+r)*S],fill=col,width=int(w*S))
def icon_minus(d,cx,cy,r,col,w=2.2):
    d.line([(cx-r)*S,cy*S,(cx+r)*S,cy*S],fill=col,width=int(w*S))
def icon_check(d,cx,cy,r,col,w=2.6):
    d.line([(cx-r)*S,cy*S,(cx-r*0.2)*S,(cy+r*0.7)*S,(cx+r)*S,(cy-r*0.7)*S],fill=col,width=int(w*S),joint="curve")
def icon_chevron_left(d,cx,cy,r,col,w=2.4):
    d.line([(cx+r*0.5)*S,(cy-r)*S,(cx-r*0.5)*S,cy*S,(cx+r*0.5)*S,(cy+r)*S],fill=col,width=int(w*S),joint="curve")
def icon_lock(d,cx,cy,col):
    rr(d,cx-6,cy-2,12,9,2,fill=col)
    d.arc([(cx-4.5)*S,(cy-9)*S,(cx+4.5)*S,(cy+2)*S],180,360,fill=col,width=int(1.6*S))

def pill(d,x,y,w,h,txt,sz,fill,txtcol,kind="r"):
    rr(d,x,y,w,h,h/2,fill=fill); T(d,x+w/2,y+h/2,txt,kind,sz,txtcol,"mm")

def dock_btn(img,d,y,label,bg,total=None,fg=None,sub_dot=None):
    fg = fg or C["white"]
    rr(d,14,y,W-28,46,13,fill=bg)
    cx=W/2
    if sub_dot is not None:
        # count badge + label + total layout
        rr(d,24,y+13,20,20,10,fill=rgba("#FFFFFF",56))
        T(d,34,y+23,sub_dot,"b",11,fg,"mm")
        T(d,52,y+23,label,"b",14,fg,"lm")
        if total: T(d,W-26,y+23,total,"b",14,fg,"rm")
    else:
        if total:
            T(d,cx,y+23,label+"   ·   "+total,"b",14,fg,"mm")
        else:
            T(d,cx,y+23,label,"b",14,fg,"mm")

# ---------------- 1 SPLASH ----------------
def splash():
    img,d=new_screen(C["surface"]); statusbar(d)
    s=make_seal(48,C["seal"]); paste(img,s,W/2-24,H/2-60)
    icon_lock(d,W/2-58,H-40,C["inkSoft"])
    T(d,W/2-46,H-40,"დაცული გადახდა","r",12,C["inkSoft"],"lm")
    return img

# ---------------- header helper ----------------
def header(img,d,title=None,logo=False,back=False,chip=True,bg=None):
    bg=bg or C["surface"]; rect(d,0,0,W,100,bg)
    statusbar(d)
    hy=44
    if back:
        icon_chevron_left(d,30,hy+28,11,C["ink"])
        T(d,46,hy+28,title,"b",17,C["ink"],"lm")
    elif logo:
        paste(img,make_seal(22,C["seal"]),20,hy+17)
    elif title:
        T(d,22,hy+28,title,"b",17,C["ink"],"lm")
    if chip:
        cw=86; pill(d,W-cw-12,hy+14,cw,28,"მაგიდა 14",12,C["paper"],C["inkSoft"])
    line(d,0,100,W)

# ---------------- 2 MENU ----------------
def menu():
    img,d=new_screen(C["surface"]); header(img,d,logo=True)
    y=112
    T(d,20,y+14,"სუფრა","sf",26,C["ink"],"lm")
    T(d,20,y+40,"რას მიირთმევთ?","r",14,C["inkSoft"],"lm")
    y+=64
    cats=[("პოპულარული",True),("სტარტერი",False),("მთავარი",False)]
    cx=20
    for txt,on in cats:
        w=len(txt)*8+24
        pill(d,cx,y,w,32,txt,13.5,C["accent"] if on else C["paper"], C["white"] if on else C["inkSoft"])
        cx+=w+8
    y+=44; line(d,0,y,W); y+=2
    dishes=[("ხინკალი კალმახით","ხელით ნაზელი ცომი, კალმახით","1.80 ₾"),
            ("აჭარული ხაჭაპური","გახსნილი ნავი, კარაქი და კვერცხი","16.00 ₾"),
            ("ჩაქაფული","კრავი, ტყემალი, ტარხუნა","28.00 ₾"),
            ("საფერავი — ჭიქა","ქვევრის მშრალი წითელი","12.00 ₾")]
    for i,(n,ds,pr) in enumerate(dishes):
        rh=84
        if i>0: line(d,20,y,W-40)
        T(d,20,y+18,n,"sf",17,C["ink"],"lm")
        T(d,20,y+40,ds,"r",13,C["inkSoft"],"lm")
        T(d,20,y+62,pr,"b",14,C["ink"],"lm")
        rr(d,W-58,y+rh/2-22,44,44,22,fill=C["accentTint"])
        icon_plus(d,W-36,y+rh/2,9,C["accent"])
        y+=rh
    dock_btn(img,d,H-66,"ნახე შეკვეთა",C["accent"],"28.60 ₾",sub_dot="2")
    return img

# ---------------- 3 ITEM SHEET ----------------
def sheet():
    img,d=menu_base()  # dim menu behind
    overlay=Image.new("RGBA",(int(W*S),int(H*S)),rgba("#221D1A",92)); img.paste(overlay,(0,0),overlay)
    sy=H*0.30
    rr(d,0,sy,W,H-sy+40,22,fill=C["surface"])
    rr(d,W/2-19,sy+9,38,5,3,fill=C["line"])
    T(d,20,sy+26,"ხინკალი კალმახით","sf",20,C["ink"],"lm")
    T(d,20,sy+52,"ხელით ნაზელი ცომი, მთის კალმახით","r",13,C["inkSoft"],"lm")
    T(d,20,sy+86,"ულუფა","r",12.5,C["inkSoft"],"lm")
    # segmented
    segy=sy+100; rr(d,20,segy,W-40,40,10,fill=C["paper"])
    segs=["5 ცალი","7 ცალი","10 ცალი"]; sw=(W-40-6)/3
    for i,t in enumerate(segs):
        on=(i==1)
        if on: rr(d,23+i*sw,segy+3,sw-2,34,8,fill=C["surface"])
        T(d,23+i*sw+sw/2,segy+20,t,"r",12,C["ink"] if on else C["inkSoft"],"mm")
    # quantity
    qy=segy+60; T(d,20,qy+20,"რაოდენობა","r",15,C["ink"],"lm")
    rr(d,W-150,qy,136,44,22,fill=C["paper"])
    icon_minus(d,W-128,qy+22,8,C["inkMute"]); T(d,W-82,qy+22,"1","b",16,C["ink"],"mm"); icon_plus(d,W-36,qy+22,8,C["accent"])
    dock_btn(img,d,H-66,"დამატება",C["accent"],"12.60 ₾")
    return img
def menu_base():
    img,d=new_screen(C["surface"]); header(img,d,logo=True)
    return img,d

# ---------------- 4 CART ----------------
def cart():
    img,d=new_screen(C["surface"]); header(img,d,title="შეკვეთა",back=True)
    y=112
    items=[("ხინკალი კალმახით","7 ცალი","12.60 ₾"),("აჭარული ხაჭაპური",None,"16.00 ₾")]
    for i,(n,sub,pr) in enumerate(items):
        if i>0: line(d,20,y,W-40)
        T(d,20,y+18,n,"sf",16,C["ink"],"lm")
        yy=y+38
        if sub: T(d,20,yy,sub,"r",12,C["inkSoft"],"lm"); yy+=16
        T(d,20,yy,pr,"b",13.5,C["ink"],"lm")
        # stepper
        rr(d,W-138,y+22,124,40,20,fill=C["paper"])
        icon_minus(d,W-118,y+42,7,C["inkMute"]); T(d,W-76,y+42,"1","b",15,C["ink"],"mm"); icon_plus(d,W-34,y+42,7,C["accent"])
        y+=80
    y+=8
    rr(d,20,y,W-40,58,16,fill=C["paper"])
    T(d,34,y+18,"დაამატეთ","r",11,C["accent"],"lm")
    T(d,34,y+38,"საფერავის სორბეტი · 9.00 ₾","r",13,C["ink"],"lm")
    rr(d,W-58,y+9,40,40,20,fill=C["accentTint"]); icon_plus(d,W-38,y+29,9,C["accent"])
    # dock: total + button
    line(d,0,H-112,W)
    T(d,20,H-92,"ჯამი","r",13,C["inkSoft"],"lm")
    T(d,W-20,H-92,"28.60 ₾","b",17,C["ink"],"rm")
    dock_btn(img,d,H-66,"გადახდა",C["accent"])
    return img

# ---------------- 5 CHECKOUT ----------------
def checkout():
    img,d=new_screen(C["paper"]); header(img,d,title="გადახდა",back=True,chip=False,bg=C["paper"])
    y=112
    rr(d,14,y,W-28,86,18,fill=C["surface"],outline=C["line"],width=1)
    T(d,W/2,y+26,"გადასახდელი","r",12,C["inkSoft"],"mm")
    T(d,W/2,y+56,"31.46 ₾","b",32,C["ink"],"mm")
    y+=104
    def seg(label, opts, ony):
        nonlocal y
        T(d,18,y,label,"r",12.5,C["inkSoft"],"lm"); y+=20
        rr(d,14,y,W-28,40,10,fill=C["paper"] if False else C["surface"],outline=C["line"],width=1)
        rr(d,14,y,W-28,40,10,fill=C["surface"]);
        rr(d,14,y,W-28,40,10,outline=C["line"],width=1)
        sw=(W-28)/len(opts)
        for i,t in enumerate(opts):
            on=(i==ony)
            if on: rr(d,17+i*sw,y+3,sw-3,34,8,fill=C["accent"] if False else C["paper"]);
            if on:
                rr(d,17+i*sw,y+3,sw-3,34,8,fill=C["accent"]) ; T(d,17+i*sw+sw/2,y+20,t,"b",12,C["white"],"mm")
            else:
                T(d,14+i*sw+sw/2,y+20,t,"r",12,C["inkSoft"],"mm")
        y+=56
    seg("ანგარიშის გაყოფა",["მთლიანი","თანაბრად","პოზიციებით"],0)
    seg("მადლობა მასპინძელს",["5%","10%","15%","არა"],1)
    T(d,18,y,"გადახდის მეთოდი","r",12.5,C["inkSoft"],"lm"); y+=20
    rr(d,14,y,W-28,116,16,fill=C["surface"],outline=C["line"],width=1)
    methods=[("Apple Pay","ერთი შეხებით",True),("ბარათი  •••• 4291","",False)]
    for i,(m,h2,on) in enumerate(methods):
        ry=y+i*58
        if i>0: line(d,28,ry,W-56)
        T(d,30,ry+ (24 if h2 else 29),m,"b",14.5,C["ink"],"lm")
        if h2: T(d,30,ry+40,h2,"r",12,C["inkSoft"],"lm")
        if on:
            d.ellipse([(W-46)*S,(ry+19)*S,(W-26)*S,(ry+39)*S],fill=C["accent"]); icon_check(d,W-36,ry+29,5,C["white"])
        else:
            d.ellipse([(W-46)*S,(ry+19)*S,(W-26)*S,(ry+39)*S],outline=C["inkMute"],width=int(1.5*S))
    line(d,0,H-112,W,C["line"])
    dock_btn(img,d,H-66,"Apple Pay",C["payBlack"],"31.46 ₾")
    return img

# ---------------- 6 SUCCESS ----------------
def success():
    img,d=new_screen(C["paper"])
    rect(d,0,0,W,86,C["surface"]); statusbar(d)
    paste(img,make_seal(20,C["seal"]),W/2-10,52); line(d,0,86,W)
    cy=140
    d.ellipse([(W/2-28)*S,cy*S,(W/2+28)*S,(cy+56)*S],fill=C["green"]); icon_check(d,W/2,cy+28,11,C["white"],3)
    T(d,W/2,cy+78,"გადახდილია","sf",20,C["ink"],"mm")
    T(d,W/2,cy+104,"შეკვეთა გადაეცა სამზარეულოს","r",12.5,C["inkSoft"],"mm")
    T(d,W/2,cy+138,"31.46 ₾","b",26,C["ink"],"mm")
    sy=cy+176
    rr(d,14,sy,W-28,86,16,fill=C["surface"],outline=C["line"],width=1)
    T(d,28,sy+22,"შეკვეთის სტატუსი","b",13,C["ink"],"lm")
    stages=[("მიღებულია",True),("მზადდება",True),("მზად არის",False)]
    bw=(W-28-2*8-24)/3
    for i,(t,on) in enumerate(stages):
        bx=28+i*(bw+8)
        rr(d,bx,sy+44,bw,6,3,fill=C["green"] if on else C["line"])
        T(d,bx,sy+62,t,"r",11,C["ink"] if on else C["inkMute"],"lm")
    # dock two buttons
    rr(d,14,H-66,W-150,46,13,fill=C["accent"]); T(d,14+(W-150)/2,H-43,"ახალი შეკვეთა","b",14,C["white"],"mm")
    rr(d,W-128,H-66,114,46,13,fill=C["surface"],outline=C["line"],width=1); T(d,W-71,H-43,"დასრულება","b",14,C["ink"],"mm")
    return img

shots=[("01-splash",splash),("02-menu",menu),("03-item-sheet",sheet),("04-cart",cart),("05-checkout",checkout),("06-success",success)]
imgs=[]
for name,fn in shots:
    im=fn(); im.save(f"{OUT}/{name}.png"); imgs.append(im); print("saved",name)

# contact sheet
gap=24*S; cols=3; rows=2
cw=imgs[0].width; ch=imgs[0].height
sheet_img=Image.new("RGB",(cols*cw+(cols+1)*gap, rows*ch+(rows+1)*gap), hx("#E4DCCD"))
for i,im in enumerate(imgs):
    r,c=divmod(i,cols)
    sheet_img.paste(im,(gap+c*(cw+gap), gap+r*(ch+gap)))
sheet_img.save(f"{OUT}/00-all-screens.png"); print("saved contact sheet", sheet_img.size, "serif_ok=",serif_ok)
