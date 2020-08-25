using Newtonsoft.Json.Linq;
using Our.Umbraco.AnimateOnScroll.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

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
