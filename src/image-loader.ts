import { S, stime } from "./index.js";

/** Simple async Image loader [from ImageReveal.loadImage()]
 *
 * see also: createjs.ImageLoader, which we don't use.
 */
export class ImageLoader {
  /**
   * Promise to load url as HTMLImageElement
   */
  loadImage(url: string): Promise<HTMLImageElement> {
    //console.log(stime(`image-loader: try loadImage`), url)
    return new Promise((res, rej) => {
      const img: HTMLImageElement = new Image();
      img.onload = (evt => res(img));
      img.onerror = ((err) => rej(`failed to load ${url} -> ${err}`));
      img.src = url; // start loading
    });
  }

  /**
   * load all imageUrls, then invoke callback(images: HTMLImageElement[])
   * @param imageUrls
   * @param cb
   */
  loadImages(imageUrls: string[], cb: (images: HTMLImageElement[]) => void) {
    let promises = imageUrls.map(url => this.loadImage(url));
    Promise.all(promises).then((values) => cb(values), (reason) => {
      console.error(stime(this, `.loadImages:`), reason);
    })
  }

  /**
   * 
   * @param args -
   * - root: path to image directory with trailing '/'
   * - fnames: string[] basenames of each image to load
   * - ext: file extension (for ex: 'png' or 'jpg')
   * 
   * @param imap supply or create new Map()
   * @param cb invoked with (imap)
   */
  constructor(args: { root: string, fnames: string[], ext: string },
    imap = new Map<string, HTMLImageElement>(),
    cb?: (imap: Map<string, HTMLImageElement>) => void)
  {
    let { root, fnames, ext } = args
    let paths = fnames.map(fn => `${root}${fn}.${ext}`)
    this.loadImages(paths, (images: HTMLImageElement[]) => {
      fnames.forEach((fn, n) => {
        images[n][S.Aname] = fn;
        imap.set(fn, images[n])
      })
      if (cb) cb(imap)
    })
  }
}
