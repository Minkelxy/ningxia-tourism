import NingxiaInteractiveMap from '../components/NingxiaInteractiveMap';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute top-20 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-soft p-4 max-w-xs">
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">
              塞上江南·神奇宁夏
            </h2>
            <p className="text-sm text-text-secondary mb-3">
              探索宁夏回族自治区的独特魅力，点击城市进入下一级
            </p>
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span>5 个地级市</span>
              <span>·</span>
              <span>11 个精选景点</span>
            </div>
          </div>
        </div>

        <div className="h-full pt-20 px-4 pb-20">
          <NingxiaInteractiveMap />
        </div>
      </div>
    </div>
  );
}
