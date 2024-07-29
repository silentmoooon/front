export default ()=>{
  return(`
        
    .Skeleton {
      background: rgb(230,230,230) !important;
      border: 0px solid transparent !important;
      box-shadow: none !important;
      cursor: inherit !important;
      line-height: 0;
      overflow: hidden;
      position: relative;
    }

    @keyframes SkeletonBackgroundAnimation {
      from {
        left: -500px;
      }
      to   {
        left: +120%;
      }
    }

    .SkeletonBackground {
      animation: 2s SkeletonBackgroundAnimation 0.2s ease infinite;
      background: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
      height: 100%;
      left: -140%;
      position: absolute;
      top: 0;
      width: 400px;
    }

    .SkeletonWrapper {
      line-height: 0;
    }
  `)
}
