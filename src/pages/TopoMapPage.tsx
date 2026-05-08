import NingxiaTopoMap from '../components/NingxiaTopoMap';

export default function TopoMapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-4">
          🗺️ 宁夏旅游地图
        </h1>
        <p className="text-text-secondary text-lg">
          基于 TopoJSON 数据的交互式地图 · 包含宁夏5个地级市
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">
            📍 交互式地图
          </h2>
          <p className="text-text-secondary">
            点击城市查看详情，悬停查看景点信息
          </p>
        </div>
        
        <div className="h-[600px]">
          <NingxiaTopoMap />
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8">
        <h3 className="text-xl font-serif font-bold text-text-primary mb-4">
          💡 TopoJSON 特点
        </h3>
        <ul className="space-y-2 text-text-secondary">
          <li>• <strong>文件更小</strong>：44KB，比GeoJSON节省约80%空间</li>
          <li>• <strong>共享边界</strong>：相邻区域共享边界线，不重复存储</li>
          <li>• <strong>数据完整</strong>：包含宁夏5个地级市的精确边界</li>
          <li>• <strong>属性丰富</strong>：每个区域包含名称、代码、中心坐标等信息</li>
        </ul>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-serif font-bold text-text-primary mb-4">
          🏙️ 宁夏5个地级市
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-lg mb-2">银川市</h4>
            <p className="text-sm text-gray-600">首府，行政中心</p>
            <p className="text-xs text-gray-500 mt-1">代码: 640100</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-bold text-lg mb-2">石嘴山市</h4>
            <p className="text-sm text-gray-600">北部工业城市</p>
            <p className="text-xs text-gray-500 mt-1">代码: 640200</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-bold text-lg mb-2">吴忠市</h4>
            <p className="text-sm text-gray-600">中部，回族聚集区</p>
            <p className="text-xs text-gray-500 mt-1">代码: 640300</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-bold text-lg mb-2">固原市</h4>
            <p className="text-sm text-gray-600">南部，六盘山区</p>
            <p className="text-xs text-gray-500 mt-1">代码: 640400</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-bold text-lg mb-2">中卫市</h4>
            <p className="text-sm text-gray-600">西部，沙坡头景区</p>
            <p className="text-xs text-gray-500 mt-1">代码: 640500</p>
          </div>
        </div>
      </div>
    </div>
  );
}
