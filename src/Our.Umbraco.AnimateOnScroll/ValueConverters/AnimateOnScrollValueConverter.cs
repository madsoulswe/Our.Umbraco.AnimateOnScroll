using Newtonsoft.Json.Linq;
using Our.Umbraco.AnimateOnScroll.Models;
using System;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Extensions;

namespace Our.Umbraco.AnimateOnScroll.ValueConverters
{
    public class AnimateOnScrollValueConverter : PropertyValueConverterBase
    {

        public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
        {
            if (inter == null)
                return null;

            var sourceString = inter.ToString();

            if (!sourceString.DetectIsJson())
                return null;

            var data = JObject.Parse(sourceString);

            return data.ToObject<Animation>();
        }
        public override bool IsConverter(IPublishedPropertyType propertyType)
        {
            return propertyType.EditorAlias == "Our.Umbraco.AnimateOnScroll";
        }

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType) => typeof(Animation);

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) => PropertyCacheLevel.Snapshot;
    }
}
