#!/usr/bin/env python3
"""验证景点坐标是否在宁夏范围内"""
import json

# 宁夏大致边界（经纬度）
NINGXIA_BOUNDS = {
    "minLng": 104.5,
    "maxLng": 107.5,
    "minLat": 35.0,
    "maxLat": 39.5
}

# 各城市大致中心坐标（用于验证景点是否在城市附近）
CITY_CENTERS = {
    "银川": {"lng": 106.27, "lat": 38.47},
    "石嘴山": {"lng": 106.37, "lat": 39.02},
    "吴忠": {"lng": 106.20, "lat": 37.99},
    "固原": {"lng": 106.28, "lat": 36.00},
    "中卫": {"lng": 105.19, "lat": 37.51},
    "青铜峡": {"lng": 106.08, "lat": 37.89},
    "灵武": {"lng": 106.34, "lat": 38.10},
    "永宁": {"lng": 106.25, "lat": 38.28},
    "盐池": {"lng": 107.41, "lat": 37.78},
    "彭阳": {"lng": 106.65, "lat": 35.85},
}

# 已知真实坐标（从搜索结果验证）
VERIFIED_COORDS = {
    "沙湖": {"lng": 106.22, "lat": 38.83, "source": "百科: 东经106°13'-106°26', 北纬38°45'-38°55'"},
    "西夏王陵": {"lng": 105.98, "lat": 38.43, "source": "Bigemap: 105.98157, 38.428326"},
    "沙坡头": {"lng": 105.00, "lat": 37.46, "source": "Bigemap: 105.003437, 37.461736"},
}

def check_in_ningxia(lng, lat):
    """检查坐标是否在宁夏范围内"""
    return (NINGXIA_BOUNDS["minLng"] <= lng <= NINGXIA_BOUNDS["maxLng"] and
            NINGXIA_BOUNDS["minLat"] <= lat <= NINGXIA_BOUNDS["maxLat"])

def distance(lng1, lat1, lng2, lat2):
    """简单计算两点距离（用于判断是否在合理范围内）"""
    return ((lng1 - lng2) ** 2 + (lat1 - lat2) ** 2) ** 0.5

def main():
    with open('/workspace/src/data/attractions.json', 'r', encoding='utf-8') as f:
        attractions = json.load(f)
    
    print("=" * 80)
    print("景点坐标验证报告")
    print("=" * 80)
    
    issues = []
    warnings = []
    
    for attr in attractions:
        name = attr["name"]
        city = attr["city"]
        lng = attr["coordinates"]["lng"]
        lat = attr["coordinates"]["lat"]
        
        # 检查是否在宁夏范围内
        in_ningxia = check_in_ningxia(lng, lat)
        
        # 检查是否在城市附近
        city_near = None
        if city in CITY_CENTERS:
            center = CITY_CENTERS[city]
            dist = distance(lng, lat, center["lng"], center["lat"])
            if dist > 1.5:  # 距离城市中心超过1.5度（约150公里）
                city_near = f"距离{city}中心较远 ({dist:.2f}度)"
        
        # 检查是否有已验证的坐标
        verified = VERIFIED_COORDS.get(name)
        if verified:
            diff_lng = abs(lng - verified["lng"])
            diff_lat = abs(lat - verified["lat"])
            if diff_lng > 0.2 or diff_lat > 0.2:
                issues.append({
                    "name": name,
                    "current": f"{lng}, {lat}",
                    "verified": f"{verified['lng']}, {verified['lat']}",
                    "source": verified["source"],
                    "diff": f"经度差:{diff_lng:.3f}, 纬度差:{diff_lat:.3f}"
                })
        
        if not in_ningxia:
            issues.append({
                "name": name,
                "issue": f"坐标不在宁夏范围内 ({lng}, {lat})"
            })
        elif city_near:
            warnings.append({
                "name": name,
                "city": city,
                "warning": city_near,
                "coords": f"{lng}, {lat}"
            })
    
    # 输出结果
    print(f"\n总共验证 {len(attractions)} 个景点")
    print(f"严重问题: {len(issues)} 个")
    print(f"警告: {len(warnings)} 个")
    
    if issues:
        print("\n" + "=" * 80)
        print("严重问题（需要修正）：")
        print("=" * 80)
        for issue in issues:
            if "current" in issue:
                print(f"\n❌ {issue['name']}")
                print(f"   当前坐标: {issue['current']}")
                print(f"   真实坐标: {issue['verified']}")
                print(f"   数据来源: {issue['source']}")
                print(f"   偏差: {issue['diff']}")
            else:
                print(f"\n❌ {issue['name']}: {issue['issue']}")
    
    if warnings:
        print("\n" + "=" * 80)
        print("警告（建议检查）：")
        print("=" * 80)
        for w in warnings:
            print(f"\n⚠️  {w['name']} ({w['city']})")
            print(f"   {w['warning']}")
            print(f"   坐标: {w['coords']}")
    
    if not issues and not warnings:
        print("\n✅ 所有景点坐标验证通过！")
    
    print("\n" + "=" * 80)
    print("各景点坐标列表：")
    print("=" * 80)
    for attr in attractions:
        name = attr["name"]
        city = attr["city"]
        lng = attr["coordinates"]["lng"]
        lat = attr["coordinates"]["lat"]
        verified = "✓" if name in VERIFIED_COORDS else " "
        print(f"{verified} {name:15s} ({city:8s}): {lng:8.2f}, {lat:8.2f}")

if __name__ == "__main__":
    main()
