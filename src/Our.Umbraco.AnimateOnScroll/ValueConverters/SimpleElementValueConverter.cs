using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web.PropertyEditors;
using Umbraco.Web.PropertyEditors.ValueConverters;

namespace Our.Umbraco.AnimateOnScroll.ValueConverters
{
    public class AnimateOnScrollValueConverter : PropertyValueConverterBase
    {
        private readonly NestedContentSingleValueConverter _nestedContentSingleValueConverter;

        public AnimateOnScrollValueConverter()
        {
        }

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        { 
            return PropertyCacheLevel.Element;
        }

        public override bool IsConverter(IPublishedPropertyType propertyType) => propertyType.EditorAlias == "Our.Umbraco.AnimateOnScroll";

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType) => typeof(IPublishedElement);

        public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
        {
            return null;

        }
    }
}
